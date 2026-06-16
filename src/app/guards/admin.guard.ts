import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  // Injeta os serviços pra não precisar de construtor (já que é uma função)
  const auth = inject(AuthService);
  const router = inject(Router);

  // Se o cara for admin, o acesso tá liberado e segue o jogo
  if (auth.isAdmin()) return true;

  // Se não for admin, decide o rumo: se tiver logado vai pra home, se não, vai pro login
  router.navigate([auth.estaLogado() ? '/' : '/login']);
  return false;
};
