import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { PokemonProfileComponent } from './pokemon/pokemon-profile/pokemon-profile.component';
import { PageNoFoundComponent } from './page-no-found/page-no-found.component';
import { PokemonEditComponent } from './pokemon/pokemon-edit/pokemon-edit.component';
import { provideHttpClient } from '@angular/common/http';

/**
 * Configuration du système de routage de l'application
 *
 * Définit toutes les routes de l'application et les composants associés.
 * L'ordre des routes est important : les routes plus spécifiques doivent
 * être déclarées avant les routes génériques.
 */
const routes: Routes =[
  // Route pour l'édition d'un Pokémon (ex: /pokemons/edit/5)
  // Doit être avant la route ':id' pour éviter les conflits
  {
    path: 'pokemons/edit/:id',
    component: PokemonEditComponent,
    title: "Édition d\'un Pokémon",
  },
  // Route pour afficher le profil détaillé d'un Pokémon (ex: /pokemons/3)
  {
    path: 'pokemons/:id',
    component: PokemonProfileComponent,
    title: 'Pokémon'
  },
  // Route pour afficher la liste de tous les Pokémons
  {
    path: 'pokemons',
    component: PokemonListComponent,
    title: 'Pokédex'
  },
  // Redirection de la route racine vers la liste des Pokémons
  { path: '', redirectTo: 'pokemons', pathMatch: 'full' },
  // Route wildcard (404) - doit toujours être en dernier
  { path: '**', component: PageNoFoundComponent },
];

/**
 * Configuration principale de l'application Angular
 *
 * Providers:
 * - provideBrowserGlobalErrorListeners : Gestion globale des erreurs
 * - provideRouter : Active le système de routage avec les routes définies ci-dessus
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
  ]
};
