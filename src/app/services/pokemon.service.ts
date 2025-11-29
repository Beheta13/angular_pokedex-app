import { Injectable } from '@angular/core';
import { PokemonList, Pokemon } from '../pokemon.model';
import { POKEMON_LIST } from '../pokemon-list.fake';

@Injectable({
  providedIn: 'root',
})
export class Pokemonservice {
  getPokemonList(): PokemonList{
    return POKEMON_LIST;
  }

  getPokemonById(id: number): Pokemon  {
    const pokeman = POKEMON_LIST.find((pokemon) => pokemon.id === id);
    if (!pokeman) {
      throw new Error(`Pokemon not found with id ${id}`);
    }
    return pokeman;
  }

  getPokemonTypeList(): string[] {
    return [
      'Feu',
      'Eau',
      'Plante',
      'Insecte',
      'Vol',
      'Poison',
      'Fée',
      'Electrik',
      'Normal',
    ];

  }

}
