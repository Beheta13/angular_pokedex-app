import { Component, signal, computed, inject } from '@angular/core';
import { Pokemon } from './pokemon.model';
import { PokemanBorder } from './pokeman-border';
import { DatePipe } from '@angular/common';
import { Pokemonservice } from './pokemon.service';

@Component({
  selector: 'app-root',
  imports: [PokemanBorder, DatePipe,],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly #pokemonService = inject(Pokemonservice);
  pokemonList = signal(this.#pokemonService.getPokemonList());

  readonly searchTerm = signal('');


  size (pokemon: Pokemon) {
    if (pokemon.life <= 15) {
      return 'Petit';
    }

    if (pokemon.life >=25) {
      return 'Grand';
    }

    return 'Moyen';
  };
  
  incrementLife(pokemon: Pokemon) {
    pokemon.life = pokemon.life + 1;
  }
  decrementLife(pokemon: Pokemon) {
    pokemon.life = pokemon.life - 1;
  }


}
