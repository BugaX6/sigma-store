import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  carregando = false;
  erro = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    // Inicializa o formulário aplicando os validadores de formato de e-mail e tamanho de senha
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getters criados para expor os controles direto pro HTML simplificar as diretivas @if
  get email() { return this.form.get('email')!; }
  get senha() { return this.form.get('senha')!; }

  entrar(): void {
    // Se o usuário não preencheu os campos direito, força os avisos vermelhos na tela e para
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    
    // Ativa o estado de loading (desabilita o botão para evitar cliques repetidos)
    this.carregando = true;

    // Dispara a autenticação passando os valores do formulário para o AuthService
    this.auth.login(this.form.value.email, this.form.value.senha).subscribe({
      next: ok => {
        // Se as credenciais estiverem certas (retornou true), joga o usuário para a Home
        if (ok) this.router.navigate(['/']);
        else { 
          // Se o e-mail ou senha estiverem errados, mostra o erro e libera o botão de novo
          this.erro = 'E-mail ou senha incorretos.';
           this.carregando = false;
           }
      },
      error: () => {
        // Trata o erro caso o json-server esteja offline ou aconteça alguma falha de rede
         this.erro = 'Erro ao conectar. Verifique se o servidor está rodando.';
          this.carregando = false; }
    });
  }
}