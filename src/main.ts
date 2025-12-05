import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Point d'entrée principal de l'application Angular
 *
 * Ce fichier initialise et démarre l'application en utilisant le mode standalone
 * (sans NgModule). bootstrapApplication monte le composant racine AppComponent
 * avec la configuration définie dans appConfig.
 *
 * La méthode catch gère les erreurs critiques lors du démarrage de l'application.
 *
 * Cette approche moderne (standalone) remplace l'ancien système basé sur les modules.
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
