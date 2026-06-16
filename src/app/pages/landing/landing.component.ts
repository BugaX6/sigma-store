import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ProdutoService } from '../../services/produto.service';
import { AuthService } from '../../services/auth.service';
import { BuscaService } from '../../services/busca.service';
import { Produto } from '../../models/produto.model';

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit, OnDestroy {
  // Listas que mudam na tela conforme o usuário pesquisa algo
  perfumesFem: Produto[] = [];
  perfumesMasc: Produto[] = [];
  cremesFem: Produto[] = [];
  cremesMasc: Produto[] = [];
  termoBusca = '';
  carregandoProdutos = true;
  erroProdutos = '';
  faqAberto: number | null = null;

  // Backups das listas originais vindas da API pra não perder os dados na busca
  private todosPerfumesFem: Produto[] = [];
  private todosPerfumesMasc: Produto[] = [];
  private todosCremesFem: Produto[] = [];
  private todosCremesMasc: Produto[] = [];
  // Centraliza as inscrições do RxJS pra limpar tudo de uma vez
  private subs = new Subscription();

  readonly faqs = [
    {
      pergunta: 'Suporte',
      resposta: 'Atendimento via WhatsApp e e-mail de segunda a sabado, das 9h as 18h.',
    },
    { pergunta: 'Seguranca', resposta: 'Seus dados sao protegidos e nunca compartilhados.' },
    { pergunta: 'Pagamento', resposta: 'Aceitamos PIX, cartao de credito e boleto bancario.' },
    {
      pergunta: 'Trocas',
      resposta: 'Trocas aceitas em ate 7 dias apos o recebimento, com produto sem uso.',
    },
    { pergunta: 'Entrega', resposta: 'Entrega para todo o Brasil. Prazo de 3 a 7 dias uteis.' },
    {
      pergunta: 'Rastreio',
      resposta: 'Codigo de rastreio enviado por e-mail apos confirmacao do pagamento.',
    },
    { pergunta: 'Frete', resposta: 'Frete gratis para compras acima de R$ 299,00.' },
    {
      pergunta: 'Originalidade',
      resposta: 'Produtos originais com nota fiscal e garantia de procedencia.',
    },
  ];

  constructor(
    private produtoService: ProdutoService,
    public auth: AuthService,
    private buscaService: BuscaService,
  ) {}

  ngOnInit(): void {
    // forkJoin bate em todos os endpoints em paralelo e entrega tudo junto no subscribe
    this.subs.add(
      forkJoin({
        perfumesFem: this.produtoService.getPerfumesFemininos(),
        perfumesMasc: this.produtoService.getPerfumesMasculinos(),
        cremesFem: this.produtoService.getCremesFemininos(),
        cremesMasc: this.produtoService.getCremesMasculinos(),
      }).subscribe({
        next: ({ perfumesFem, perfumesMasc, cremesFem, cremesMasc }) => {
          this.todosPerfumesFem = perfumesFem;
          this.todosPerfumesMasc = perfumesMasc;
          this.todosCremesFem = cremesFem;
          this.todosCremesMasc = cremesMasc;
          this.carregandoProdutos = false;
          this.erroProdutos = '';
          this.aplicarBusca();// Garante que se já houver um termo digitado, filtra na hora
        },
        error: () => this.registrarErroProdutos(),
      }),
    );

    // Fica ouvindo a barra de pesquisa da Navbar pelo service global
    this.subs.add(
      this.buscaService.termo$.subscribe((termo) => {
        this.termoBusca = termo;
        this.aplicarBusca();
      }),
    );
  }

  // Destrói as escutas do RxJS(Controla quando as coisas acontece) para evitar vazamento de memória no navegador
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Abre o item do FAQ clicado ou fecha se o cara clicar de novo no mesmo
  toggleFaq(index: number): void {
    this.faqAberto = this.faqAberto === index ? null : index;
  }

  formatarPreco(preco: number): string {
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Somatório rápido das listas pra saber se sobrou algum produto na tela após o filtro
  temResultadoBusca(): boolean {
    return (
      this.perfumesFem.length +
        this.perfumesMasc.length +
        this.cremesFem.length +
        this.cremesMasc.length >
      0
    );
  }

  // Adiciona o item na sacola salvando no localStorage pra persistir o dado
  adicionarCarrinho(produto: Produto): void {
    const localData = localStorage.getItem('sigma_carrinho');
    const carrinho: ItemCarrinho[] = localData ? JSON.parse(localData) : [];
    
    // Verifica se esse produto já tá na sacola batendo ID e Tipo (perfume/creme)
    const existente = carrinho.find(
      (item) => item.produto.id === produto.id && item.produto.tipo === produto.tipo,
    );
    if (existente) {
      existente.quantidade++;
    } else {
      carrinho.push({ produto, quantidade: 1 });
    }

    localStorage.setItem('sigma_carrinho', JSON.stringify(carrinho));
    alert(`"${produto.nome}" adicionado ao carrinho!`);
  }

  // Atualiza as quatro listas visuais com base nas listas globais salvas no backup
  private aplicarBusca(): void {
    this.perfumesFem = this.filtrarProdutos(this.todosPerfumesFem);
    this.perfumesMasc = this.filtrarProdutos(this.todosPerfumesMasc);
    this.cremesFem = this.filtrarProdutos(this.todosCremesFem);
    this.cremesMasc = this.filtrarProdutos(this.todosCremesMasc);
  }

  // Lógica inteligente de busca que junta tudo numa string só e vê se bate com o que foi digitado
  private filtrarProdutos(produtos: Produto[]): Produto[] {
    if (!this.termoBusca) return produtos;

    return produtos.filter((produto) => {
      const texto =
        `${produto.nome} ${produto.marca} ${produto.tipo} ${produto.categoria}`.toLowerCase();
      return texto.includes(this.termoBusca);
    });
  }

  private registrarErroProdutos(): void {
    this.erroProdutos =
      'Nao foi possivel carregar os produtos. Verifique se o json-server esta rodando.';
    this.carregandoProdutos = false;
  }
}
