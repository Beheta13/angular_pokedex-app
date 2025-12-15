import { LoginComponent } from './login/login.component';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { PokemonProfileComponent } from './pokemon/pokemon-profile/pokemon-profile.component';
import { PageNoFoundComponent } from './page-no-found/page-no-found.component';
import { PokemonEditComponent } from './pokemon/pokemon-edit/pokemon-edit.component';
import { provideHttpClient } from '@angular/common/http';
import { PokemonAddComponent } from './pokemon/pokemon-add/pokemon-add.component';
import { PokemonService } from './services/pokemon.service';
import { PokemonJSONServerService } from './services/pokemon-json-server.service';

/**
 * Factory function pour instancier le service Pokémon approprié
 *
 * Sélectionne automatiquement l'implémentation du service selon l'environnement :
 * - PRODUCTION : PokemonLocalStorageService (stockage local dans le navigateur)
 * - DÉVELOPPEMENT : PokemonJSONServerService (API REST sur localhost:3000)
 *
 * Ce pattern permet de changer facilement de backend sans modifier le code
 * des composants, respectant ainsi le principe d'injection de dépendances.
 *
 * @returns Instance de PokemonService (LocalStorage ou JSONServer)
 */
export function pokemonServiceFactory(): PokemonService {
  // return environment.production
  //   ? new PokemonLocalStorageService()
    return new PokemonJSONServerService();
}

/**
 * Configuration du système de routage de l'application
 *
 * Définit toutes les routes de l'application et les composants associés.
 * L'ordre des routes est important : les routes plus spécifiques doivent
 * être déclarées avant les routes génériques.
 *
 * Structure hiérarchique avec routes protégées par AuthGuard :
 * - /login : Page publique de connexion
 * - /pokemons : Routes protégées nécessitant authentification
 *   - /pokemons : Liste des Pokémons
 *   - /pokemons/:id : Profil détaillé d'un Pokémon
 *   - /pokemons/edit/:id : Édition d'un Pokémon
 */
const routes: Routes =[
  // Route publique de connexion - accessible sans authentification
  {
    path: 'login',
    component: LoginComponent,
    title: 'Page de connexion',
  },
  // Routes protégées - nécessitent une authentification via AuthGuard
  // canActivateChild protège toutes les routes enfants
  {
    path: 'pokemons',
    // canActivateChild: [AuthGuard],
    children: [

        {
          path: 'add',
          component: PokemonAddComponent,
          title: "Ajout d'un Pokémon",
        },
        // Route pour l'édition d'un Pokémon (ex: /pokemons/edit/5)
        // Doit être avant la route ':id' pour éviter les conflits de routage
        {
          path: 'edit/:id',
          component: PokemonEditComponent,
          title: "Édition d\'un Pokémon",
        },
        // Route pour afficher le profil détaillé d'un Pokémon (ex: /pokemons/3)
        {
          path: ':id',
          component: PokemonProfileComponent,
          title: 'Pokémon'
        },
        // Route pour afficher la liste de tous les Pokémons (ex: /pokemons)
        {
          path: '',
          component: PokemonListComponent,
          title: 'Pokédex',
        },
    ],
  },

  // Redirection de la route racine vers la liste des Pokémons
  { path: '', redirectTo: 'pokemons', pathMatch: 'full' },
  // Route wildcard (404) - doit toujours être en dernier
  // Capture toutes les URLs non définies et affiche une page d'erreur
  { path: '**', component: PageNoFoundComponent },
];

/**
 * Configuration principale de l'application Angular
 *
 * Cette configuration définit les providers globaux nécessaires au fonctionnement
 * de l'application. Elle est importée dans main.ts lors du bootstrap de l'application.
 *
 * Providers configurés :
 * - provideBrowserGlobalErrorListeners : Capture et gère les erreurs globales de l'application
 * - provideRouter : Active le système de routage avec les routes définies ci-dessus
 * - provideHttpClient : Configure le client HTTP pour les appels API REST
 *   (nécessaire pour HttpClient utilisé dans pokemon.service.ts)
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
     {
      provide: PokemonService,
      useFactory: pokemonServiceFactory,
    },
  ],
};
