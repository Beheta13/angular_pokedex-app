import { Component, signal, computed, inject } from '@angular/core';
import { Pokemon } from '../../pokemon.model';
import { PokemanBorder } from '../../pokeman-border';
import { DatePipe } from '@angular/common';
import { Pokemonservice } from '../../services/pokemon.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  imports: [PokemanBorder, DatePipe, RouterLink],
  templateUrl: './pokemon-list.component.html',
  styles: ``,
})
export class PokemonListComponent {
  readonly #pokemonService = inject(Pokemonservice);
  readonly pokemonList = signal(this.#pokemonService.getPokemonList());
  readonly searchTerm = signal('');

  readonly pokemonListFiltered = computed(() => {
    const searchTerm = this.searchTerm();
    const pokemonList = this.pokemonList();

    return pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  });


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

