import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  form: FormGroup;
  carregando = false;
  erro = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', Validators.required]
    }, { validators: this.senhasIguais }); // Aplica a validação customizada no formulário inteiro
  }

  // Compara os dois campos. Se forem diferentes, joga o erro 'senhasDiferentes' pro form
  senhasIguais(form: FormGroup) {
    return form.get('senha')?.value === form.get('confirmar')?.value ? null : { senhasDiferentes: true };
  }

  // Atalho esperto pra não precisar ficar escrevendo 'form.get()' gigante lá no HTML
  campo(nome: string) { return this.form.get(nome)!; }

  cadastrar(): void {
    // Se o form estiver zoado ou as senhas não baterem, força o erro na tela e para a execução
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.carregando = true; 
    const { nome, email, senha } = this.form.value; // Destrutura pra não enviar o 'confirmar' pro back-end

    // Dispara o cadastro e, se der bom, joga o usuário pra tela de login
    this.auth.cadastrar({ nome, email, senha }).subscribe({
      next: () => { alert('Conta criada! Faça login.'); this.router.navigate(['/login']); },
      error: () => { this.erro = 'Erro ao cadastrar. Verifique se o servidor está rodando.'; this.carregando = false; }
    });
  }
}