// Importa a interface ApplicationConfig e a função provideZoneChangeDetection do módulo principal do Angular
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

// Importa a função provideRouter para configurar o sistema de roteamento da aplicação
import { provideRouter } from '@angular/router';

// Importa a função provideHttpClient para habilitar o cliente HTTP da aplicação
import { provideHttpClient } from '@angular/common/http';

// Importa o array de rotas definidas no arquivo app.routes
import { routes } from './app.routes';

// Exporta a configuração da aplicação Angular com todos os provedores necessários
export const appConfig: ApplicationConfig = {
  // Define o array de provedores que serão disponibilizados na aplicação
  providers: [
    // Habilita a detecção de mudanças automática com coalescência de eventos para melhor performance
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Configura o sistema de roteamento da aplicação com as rotas importadas
    provideRouter(routes),
    
    // Fornece o cliente HTTP para que a aplicação possa fazer requisições para o backend
    provideHttpClient()
  ]
};