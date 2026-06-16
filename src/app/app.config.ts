import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router'; 
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  // Array de providers: injeta os serviços globais que toda a aplicação vai usar
  providers: [
    provideRouter(
      routes, 
      // Configuração inteligente para gerenciar o comportamento de rolagem da tela
      withInMemoryScrolling({ anchorScrolling: 'enabled', // Ativa o suporte a links de âncora (ex: #perfumes)
         scrollPositionRestoration: 'enabled' // Joga o scroll pro topo (0,0) automaticamente ao mudar de rota
         })
    ),
    // Habilita o HttpClient globalmente para permitir o consumo de APIs (via json-server) nos services
    provideHttpClient()
  ]
};