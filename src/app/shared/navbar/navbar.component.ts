import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BuscaService } from '../../services/busca.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(
    public auth: AuthService,
    private router: Router,
    private buscaService: BuscaService,
  ) {}

  // Consulta o AuthService para saber se libera o link do painel admin no HTML
  mostrarAdmin(): boolean {
    return this.auth.isAdmin();
  }

  // Verifica se existe uma sessão ativa para alternar entre os botões de Login e Sair
  estaLogado(): boolean {
    return this.auth.estaLogado();
  }

  // Captura o evento de digitação, atualiza o service global de busca e redireciona se necessário
  buscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const termo = input.value;

    // Dispara o novo texto digitado para o BehaviorSubject do BuscaService
    this.buscaService.atualizarTermo(termo);

    // Sacada de mestre: se o usuário digitar algo e não estiver na Home, força o redirecionamento  
    if (termo.trim() && this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }

  // Zera o valor visual do input de texto e limpa o estado do filtro global no service
  limparBusca(input?: HTMLInputElement): void {
    if (input) input.value = '';
    this.buscaService.limpar();
  }

  // Destrói a sessão do usuário no localStorage e joga ele direto para a tela de login
  sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
