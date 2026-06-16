import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Se o usuário tá logado, passa direto e entra na rota
  if (auth.estaLogado()) return true;

// Se não tá logado, barra o acesso e chuta ele direto pra tela de login
  router.navigate(['/login']);
  return false;
};