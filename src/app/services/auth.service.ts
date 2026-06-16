import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:3000/usuarios';
  private chave = 'sigma_usuario'; // Nome da chave que vai guardar a sessão no navegador

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<boolean> {
    // Busca a lista de usuários e transforma a resposta com o map do RxJS(Quando as coisas vão acontecer)
    return this.http.get<Usuario[]>(this.api).pipe(
      map((usuarios) => {
        // Procura se existe alguém com o e-mail e senha digitados  
        const encontrado = usuarios.find((u) => u.email === email && u.senha === senha);
        if (encontrado) {
          // Se achou, grava os dados dele no localStorage (menos a senha, por segurança)
          localStorage.setItem(
            this.chave,
            JSON.stringify({ id: encontrado.id, nome: encontrado.nome, email: encontrado.email }),
          );
          return true; // Retorna true pro componente saber que deu bom
        }
        return false; // Retorna false se não achar ninguém
      }),
    );
  }

  // Dispara um POST para salvar o novo usuário lá no arquivo do json-server
  cadastrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.api, usuario);
  }

  // Limpa o token/dados do usuário para deslogar do sistema
  logout(): void {
    localStorage.removeItem(this.chave);
  }

  // O operador '!!' converte o retorno para boolean puro (true se o dado existir, false se for null)
  estaLogado(): boolean {
    return !!localStorage.getItem(this.chave);
  }

  // Pega os dados do usuário logado e converte de string para objeto JavaScript de novo
  getUsuario(): { id: number | string | undefined; nome: string; email: string } | null {
    const dados = localStorage.getItem(this.chave);
    return dados ? JSON.parse(dados) : null;
  }

  // Regra de negócio simples para o adminGuard: se o e-mail for esse, libera as telas administrativas
  isAdmin(): boolean {
    return this.getUsuario()?.email === 'admin@sigma.com';
  }
}
