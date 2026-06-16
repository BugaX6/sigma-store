import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ItemCarrinho } from '../../models/produto.model';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css'
})
export class CarrinhoComponent implements OnInit {
  itens: ItemCarrinho[] = [];

  // Puxa os produtos salvos assim que a tela carrega
  ngOnInit(): void {
    this.carregarCarrinho();
  }

  // Busca a string do localStorage e converte de volta para um array de objetos
  carregarCarrinho(): void {
    this.itens = JSON.parse(localStorage.getItem('sigma_carrinho') || '[]');
  }

  aumentar(item: ItemCarrinho): void {
    item.quantidade++;
    this.salvar(); // Atualiza o localStorage pra manter o dado atualizado
  }

  diminuir(item: ItemCarrinho): void {
    // Se tiver mais de 1, só diminui. Se chegar a 1 e o cara clicar em menos, remove da sacola
    if (item.quantidade > 1) {
      item.quantidade--;
    } else {
      this.remover(item);
      return;
    }
    this.salvar();
  }

  remover(item: ItemCarrinho): void {
    // Filtra o array tirando apenas o item que o usuário clicou para deletar
    this.itens = this.itens.filter(i => i !== item);
    this.salvar();
  }

  // Transforma o array em texto (JSON string) pra conseguir gravar no localStorage do navegador
  salvar(): void {
    localStorage.setItem('sigma_carrinho', JSON.stringify(this.itens));
  }

  // Getter esperto que roda o reduce pra calcular o subtotal de tudo baseado nos preços e quantidades
  get total(): number {
    return this.itens.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0);
  }


  formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Simula a finalização da compra, limpa o array local e reseta o banco local do navegador
  finalizar(): void {
    if (this.itens.length === 0) { alert('Seu carrinho está vazio!'); return; }
    alert('Pedido finalizado com sucesso! 🎉');
    this.itens = [];
    this.salvar();
  }
}