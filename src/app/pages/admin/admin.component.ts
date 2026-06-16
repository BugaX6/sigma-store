import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Produto } from '../../models/produto.model';
import { ProdutoAdmin, ProdutoService } from '../../services/produto.service';

interface CategoriaAdmin {
  endpoint: string;
  label: string;
  categoria: Produto['categoria'];
  tipo: Produto['tipo'];
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  produtos: ProdutoAdmin[] = [];
  form: FormGroup;
  carregando = false;
  salvando = false;
  erro = '';
  sucesso = '';

  // Mapeia os endpoints do json-server pra facilitar na hora de salvar e listar
  readonly categorias: CategoriaAdmin[] = [
    {
      endpoint: 'perfumes_femininos',
      label: 'Perfume feminino',
      categoria: 'feminino',
      tipo: 'perfume',
    },
    {
      endpoint: 'perfumes_masculinos',
      label: 'Perfume masculino',
      categoria: 'masculino',
      tipo: 'perfume',
    },
    { endpoint: 'cremes_femininos', label: 'Creme feminino', categoria: 'feminino', tipo: 'creme' },
    {
      endpoint: 'cremes_masculinos',
      label: 'Creme masculino',
      categoria: 'masculino',
      tipo: 'creme',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
  ) {
    // Configura os campos do formulário com as validações obrigatórias
    this.form = this.fb.group({
      endpoint: ['perfumes_femininos', Validators.required],
      nome: ['', [Validators.required, Validators.minLength(2)]],
      marca: ['', [Validators.required, Validators.minLength(2)]],
      preco: [null, [Validators.required, Validators.min(0.01)]],
      img: ['', Validators.required],
    });
  }

  // Assim que o componente brota na tela, já puxa os produtos cadastrados
  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.erro = '';

    this.produtoService.getProdutosAdmin().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.carregando = false;
      },
      error: () => {
        this.erro =
          'Nao foi possivel carregar os produtos. Verifique se o json-server esta rodando.';
        this.carregando = false;
      },
    });
  }

  salvarProduto(): void {
    // Se faltar preencher algo, avisa o Angular pra pintar os campos de erro na tela
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Acha a categoria selecionada pra saber qual o endpoint correto do banco
    const categoria = this.categorias.find((item) => item.endpoint === this.form.value.endpoint);
    if (!categoria) return;

    // Monta o objeto final do produto juntando o form com a categoria/tipo corretos
    const produto: Produto = {
      nome: this.form.value.nome,
      marca: this.form.value.marca,
      preco: Number(this.form.value.preco),
      img: this.form.value.img,
      categoria: categoria.categoria,
      tipo: categoria.tipo,
    };

    this.salvando = true;
    this.erro = '';
    this.sucesso = '';

    // Dispara a criação pro serviço e, se der bom, limpa o form e atualiza a lista
    this.produtoService.adicionarProdutoAdmin(categoria.endpoint, produto).subscribe({
      next: () => {
        this.sucesso = 'Produto cadastrado com sucesso.';
        this.form.reset({
          endpoint: categoria.endpoint,
          nome: '',
          marca: '',
          preco: null,
          img: '',
        });
        this.salvando = false;
        this.carregarProdutos(); // Atualiza a tabela na hora
      },
      error: () => {
        this.erro = 'Nao foi possivel cadastrar o produto.';
        this.salvando = false;
      },
    });
  }

  removerProduto(produto: ProdutoAdmin): void {
    if (!produto.id) return;

    const confirmou = confirm(`Remover "${produto.nome}" da loja?`);
    if (!confirmou) return;

    this.erro = '';
    this.sucesso = '';

    // Deleta do banco e, no sucesso, remove direto do array local pro usuário ver o sumiço na hora
    this.produtoService.removerProdutoAdmin(produto.endpoint, produto.id).subscribe({
      next: () => {
        this.sucesso = 'Produto removido com sucesso.';
        this.produtos = this.produtos.filter((item) => item !== produto);
      },
      error: () => {
        this.erro = 'Nao foi possivel remover o produto.';
      },
    });
  }

  // Pega o endpoint e devolve o texto amigável pra mostrar na tabela (ex: 'perfumes_femininos' vira 'Perfume feminino')
  categoriaLabel(endpoint: string): string {
    return this.categorias.find((item) => item.endpoint === endpoint)?.label ?? endpoint;
  }

  // Formata o número pra moeda brasileira (R$)
  formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
