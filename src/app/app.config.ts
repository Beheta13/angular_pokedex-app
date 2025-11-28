import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { PokemonProfileComponent } from './pokemon/pokemon-profile/pokemon-profile.component';
import { PageNoFoundComponent } from './page-no-found/page-no-found.component';

const routes: Routes =[
  { path: 'pokemons/:id', component: PokemonProfileComponent, title: 'Pokémon' },
  { path: 'pokemons', component: PokemonListComponent, title: 'Pokédex' },
  { path: '', redirectTo: 'pokemons', pathMatch: 'full' },
  { path: '**', component: PageNoFoundComponent },
];

export const appConfig: ApplicationConfig = {
  providers: [ 
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ]
};
