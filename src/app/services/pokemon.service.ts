import { inject, Injectable } from '@angular/core';
import { PokemonList, Pokemon } from '../pokemon.model';
import { POKEMON_LIST } from '../pokemon-list.fake';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service de gestion des Pokémons
 *
 * Ce service centralise toute la logique métier liée aux Pokémons.
 * Il fournit des méthodes pour récupérer, filtrer et manipuler les données
 * des Pokémons dans toute l'application.
 *
 * @Injectable avec 'root' : Une seule instance du service est créée
 * et partagée dans toute l'application (singleton).
 */
@Injectable({
  providedIn: 'root',
})
export class Pokemonservice {
  /**
   * Récupère la liste complète de tous les Pokémons
   *
   * @returns La liste complète des Pokémons disponibles
   */


  readonly #POKEMON_API_URL = 'http://localhost:3000/pokemons';
  readonly #http = inject(HttpClient);

  getPokemonList(): Observable<PokemonList>{
    return this.#http.get<PokemonList>(this.#POKEMON_API_URL);
  }

  /**
   * Récupère un Pokémon spécifique par son ID
   *
   * @param id - L'identifiant unique du Pokémon recherché
   * @returns Le Pokémon correspondant à l'ID
   * @throws Error si aucun Pokémon n'est trouvé avec cet ID
   */
  getPokemonById(id: number): Observable<Pokemon> {
    const url = this.#POKEMON_API_URL + '/' + id;
    return this.#http.get<Pokemon>(url);
  }

  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    const url = this.#POKEMON_API_URL + '/' + pokemon.id;
    return this.#http.put<Pokemon>(url, pokemon);
  }

  deletePokemon(id: number): Observable<void> {
    const url = this.#POKEMON_API_URL + '/' + id;
    return this.#http.delete<void>(url);
  }

  /**
   * Détermine la couleur du texte à utiliser pour les badges de type
   *
   * @param type - Le type du Pokémon
   * @returns 'black' pour le type Electrik (fond jaune clair), 'white' pour les autres
   *
   * Cette méthode assure une bonne lisibilité du texte sur les badges colorés
   */
  getChipTextColor(type: string): "black" | "white" {
    return type=== 'Electrik' ? 'black' : 'white';
  }

  /**
   * Récupère la liste de tous les types de Pokémons disponibles
   *
   * @returns Un tableau contenant tous les types possibles
   *
   * Utilisé principalement dans le formulaire d'édition pour afficher
   * les checkboxes de sélection de types
   */
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
