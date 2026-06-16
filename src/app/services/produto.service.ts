import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Produto, ItemCarrinho } from '../models/produto.model';

export interface ProdutoAdmin extends Produto {
  endpoint: string;
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private api = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Busca todos os perfumes femininos
  getPerfumesFemininos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.api}/perfumes_femininos`);
  }

  // Busca todos os perfumes masculinos
  getPerfumesMasculinos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.api}/perfumes_masculinos`);
  }

  // Busca todos os cremes femininos
  getCremesFemininos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.api}/cremes_femininos`);
  }

  // Busca todos os cremes masculinos
  getCremesMasculinos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.api}/cremes_masculinos`);
  }

  // Carrinho
  getCarrinho(): Observable<ItemCarrinho[]> {
    return this.http.get<ItemCarrinho[]>(`${this.api}/carrinho`);
  }

  adicionarAoCarrinho(item: ItemCarrinho): Observable<ItemCarrinho> {
    return this.http.post<ItemCarrinho>(`${this.api}/carrinho`, item);
  }

  removerDoCarrinho(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.api}/carrinho/${id}`);
  }

  atualizarQuantidade(id: number | string, item: ItemCarrinho): Observable<ItemCarrinho> {
    return this.http.put<ItemCarrinho>(`${this.api}/carrinho/${id}`, item);
  }

  limparCarrinho(itens: ItemCarrinho[]): void {
    itens.forEach((i) => this.removerDoCarrinho(i.id!).subscribe());
  }

  // =========================================================
  // 🔥 ADICIONE ESTAS DUAS FUNÇÕES ABAIXO NO SEU SERVICE:
  // =========================================================

  // Função para ADICIONAR (POST) em qualquer uma das 4 tabelas
  getProdutosAdmin(): Observable<ProdutoAdmin[]> {
    const endpoints = [
      'perfumes_femininos',
      'perfumes_masculinos',
      'cremes_femininos',
      'cremes_masculinos',
    ];

    return forkJoin(
      endpoints.map((endpoint) =>
        this.http
          .get<Produto[]>(`${this.api}/${endpoint}`)
          .pipe(map((produtos) => produtos.map((produto) => ({ ...produto, endpoint })))),
      ),
    ).pipe(map((grupos) => grupos.flat()));
  }

  adicionarProdutoAdmin(endpoint: string, produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(`${this.api}/${endpoint}`, produto);
  }

  // Função para REMOVER (DELETE) de qualquer uma das 4 tabelas
  removerProdutoAdmin(endpoint: string, id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${endpoint}/${id}`);
  }
}
