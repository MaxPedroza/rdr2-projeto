// Importa a função bootstrapApplication do módulo plataforma do Angular para inicializar a aplicação
import { bootstrapApplication } from '@angular/platform-browser';

// Importa a configuração da aplicação definida no arquivo app.config.ts
import { appConfig } from './app/app.config';

// Importa o componente raiz (AppComponent) que será renderizado quando a aplicação inicializar
import { AppComponent } from './app/app';

// Inicializa a aplicação Angular no DOM usando o AppComponent como componente raiz
// Passa a configuração da aplicação (appConfig) como segundo argumento
// O .catch() captura e exibe qualquer erro que possa ocorrer durante a inicialização
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));