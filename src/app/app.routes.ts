import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { AdminComponent } from './pages/admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Rota raiz (Home): Carrega a Landing Page principal da loja
  { path: '', component: LandingComponent, title: 'Sigma Store' },
  // Rotas de Autenticação
  { path: 'login', component: LoginComponent, title: 'Sigma Store — Login' },
  { path: 'cadastro', component: CadastroComponent, title: 'Sigma Store — Cadastro' },

  // Rota do Carrinho: Protegida pelo authGuard (só entra quem estiver logado)
  {
    path: 'carrinho',
    component: CarrinhoComponent,
    title: 'Sigma Store — Carrinho',
    canActivate: [authGuard],
  },

  // Rota Administrativa: Protegida pelo adminGuard (só entra o email de admin)
  {
    path: 'admin',
    component: AdminComponent,
    title: 'Sigma Store Admin',
    canActivate: [adminGuard],
  },

  // Rota Coringa: Se a URL digitada não bater com nenhuma das de cima, redireciona para a Home
  { path: '**', redirectTo: '' },
];
