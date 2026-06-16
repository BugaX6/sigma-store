import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BuscaService {
  // O BehaviorSubject guarda o estado da busca (começa com uma string vazia)
  private termoSubject = new BehaviorSubject<string>('');
  // Expõe apenas como Observable para os componentes conseguirem dar 'subscribe' (escutar as mudanças)
  termo$ = this.termoSubject.asObservable();

  // Método que a Navbar chama a cada tecla digitada. Trata o texto para evitar espaços bobos e quebra de caixa
  atualizarTermo(termo: string): void {
    this.termoSubject.next(termo.trim().toLowerCase());
  }

  // Reseta a busca voltando o estado para vazio (bom para quando muda de página)
  limpar(): void {
    this.termoSubject.next('');
  }
}
