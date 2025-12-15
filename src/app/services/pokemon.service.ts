import { Signal, signal } from '@angular/core';
// import { inject, Injectable } from '@angular/core';
import { HttpResourceRef } from '@angular/common/http';
import { PokemonList, Pokemon } from '../pokemon.model';
// import { POKEMON_LIST } from '../pokemon-list.fake';
// import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// /**
//  * Service de gestion des Pokémons avec API REST
//  *
//  * Ce service centralise toute la logique métier liée aux Pokémons.
//  * Il communique avec une API REST backend (JSON Server) pour effectuer
//  * les opérations CRUD (Create, Read, Update, Delete) sur les Pokémons.
//  *
//  * Toutes les méthodes retournent des Observables pour gérer l'asynchronisme
//  * des requêtes HTTP.
//  *
//  * @Injectable avec 'root' : Une seule instance du service est créée
//  * et partagée dans toute l'application (singleton).
//  */
//   @Injectable({
//   providedIn: 'root',
// })
// export class PokemonService {

//   // URL de base de l'API REST (JSON Server sur le port 3000)
//   readonly #POKEMON_API_URL = 'http://localhost:3000/pokemons';

//   // Injection du client HTTP pour effectuer les requêtes vers l'API
//   readonly #http = inject(HttpClient);

//   /**
//    * Récupère la liste complète de tous les Pokémons depuis l'API
//    *
//    * @returns Un Observable contenant la liste complète des Pokémons
//    *
//    * Effectue une requête HTTP GET vers /pokemons
//    */
//   getPokemonList(): Observable<PokemonList>{
//     return this.#http.get<PokemonList>(this.#POKEMON_API_URL);
//   }

//   /**
//    * Récupère un Pokémon spécifique par son ID depuis l'API
//    *
//    * @param id - L'identifiant unique du Pokémon recherché
//    * @returns Un Observable contenant le Pokémon correspondant à l'ID
//    *
//    * Effectue une requête HTTP GET vers /pokemons/:id
//    */
//   getPokemonById(id: number): Observable<Pokemon> {
//     const url = this.#POKEMON_API_URL + '/' + id;
//     return this.#http.get<Pokemon>(url);
//   }

//   /**
//    * Met à jour un Pokémon existant dans l'API
//    *
//    * @param pokemon - Le Pokémon avec les modifications à sauvegarder
//    * @returns Un Observable contenant le Pokémon mis à jour
//    *
//    * Effectue une requête HTTP PUT vers /pokemons/:id
//    * Remplace complètement le Pokémon existant par les nouvelles données
//    */
//   updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
//     return this.#http.put<Pokemon>(`${this.#POKEMON_API_URL}/${pokemon.id}`, pokemon);
//   }

//   /**
//    * Supprime un Pokémon de l'API
//    *
//    * @param id - L'identifiant du Pokémon à supprimer
//    * @returns Un Observable vide (void) confirmant la suppression
//    *
//    * Effectue une requête HTTP DELETE vers /pokemons/:id
//    */
//   deletePokemon(id: number): Observable<void> {
//     return this.#http.delete<void>(`${this.#POKEMON_API_URL}/${id}`);
//   }

//   /**
//    * Ajoute un nouveau Pokémon dans l'API
//    *
//    * @param pokemon - Les données du nouveau Pokémon (sans l'ID qui sera généré automatiquement)
//    * @returns Un Observable contenant le Pokémon créé avec son ID
//    *
//    * Effectue une requête HTTP POST vers /pokemons
//    * L'API génère automatiquement l'ID du nouveau Pokémon
//    *
//    * Utilise Omit<Pokemon, 'id'> pour indiquer que l'ID n'est pas requis
//    */
//   addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon> {
//     return this.#http.post<Pokemon>(this.#POKEMON_API_URL, pokemon);
//   }

//   /**
//    * Détermine la couleur du texte à utiliser pour les badges de type
//    *
//    * @param type - Le type du Pokémon
//    * @returns 'black' pour le type Electrik (fond jaune clair), 'white' pour les autres
//    *
//    * Cette méthode assure une bonne lisibilité du texte sur les badges colorés
//    */
//   getChipTextColor(type: string): "black" | "white" {
//     return type=== 'Electrik' ? 'black' : 'white';
//   }

//   /**
//    * Récupère la liste de tous les types de Pokémons disponibles
//    *
//    * @returns Un tableau contenant tous les types possibles
//    *
//    * Utilisé principalement dans le formulaire d'édition pour afficher
//    * les checkboxes de sélection de types
//    */
//   getPokemonTypeList(): string[] {
//     return [
//       'Feu',
//       'Eau',
//       'Plante',
//       'Insecte',
//       'Vol',
//       'Poison',
//       'Fée',
//       'Electrik',
//       'Normal',
//     ];

//   }

// }

/**
 * Interface abstraite définissant le contrat du service Pokémon
 *
 * Cette classe abstraite sert d'interface pour toutes les implémentations
 * du service Pokémon. Elle garantit que toutes les implémentations
 * (PokemonJSONServerService, PokemonLocalStorageService) respectent
 * la même signature de méthodes.
 *
 * Pattern utilisé : Strategy Pattern
 * - Permet de changer facilement d'implémentation (localStorage vs API)
 * - Les composants dépendent de l'abstraction, pas de l'implémentation concrète
 * - Facilite les tests unitaires (mock du service)
 *
 * Implémentations disponibles :
 * - PokemonJSONServerService : Utilise une API REST (JSON Server)
 * - PokemonLocalStorageService : Utilise le localStorage du navigateur
 *
 * L'implémentation utilisée est déterminée par pokemonServiceFactory()
 * dans app.config.ts selon l'environnement (dev/prod)
 */
export abstract class PokemonService {
  /**
   * Récupère la liste complète de tous les Pokémons
   *
   * CHANGEMENT IMPORTANT : Cette méthode retourne maintenant HttpResourceRef
   * au lieu d'Observable pour bénéficier des nouvelles fonctionnalités Angular :
   * - Gestion automatique des états de chargement
   * - Intégration native avec les Signals
   * - Mise à jour optimiste avec .update()
   *
   * @returns HttpResourceRef<PokemonList> - Resource HTTP avec Signals intégrés
   */
  abstract getPokemonList(): HttpResourceRef<PokemonList>;

  /**
   * Récupère un Pokémon spécifique par son ID
   * @param id - L'identifiant unique du Pokémon
   * @returns Observable contenant le Pokémon correspondant
   */
  abstract getPokemonById(id: Signal<number>): HttpResourceRef<Pokemon|undefined>;

  /**
   * Met à jour un Pokémon existant
   * @param pokemon - Le Pokémon avec les modifications à sauvegarder
   * @returns Observable contenant le Pokémon mis à jour
   */
  abstract updatePokemon(pokemon: Pokemon): Observable<Pokemon>;

  /**
   * Supprime un Pokémon
   * @param pokemonId - L'identifiant du Pokémon à supprimer
   * @returns Observable vide confirmant la suppression
   */
  abstract deletePokemon(pokemonId: number): Observable<void>;

  /**
   * Ajoute un nouveau Pokémon
   * @param pokemon - Les données du nouveau Pokémon (sans l'ID)
   * @returns Observable contenant le Pokémon créé avec son ID généré
   */
  abstract addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon>;

  /**
   * Retourne la liste de tous les types de Pokémons disponibles
   * @returns Tableau contenant tous les types possibles (Feu, Eau, Plante, etc.)
   */
  abstract getPokemonTypeList(): string[];

  /**
   * Détermine la couleur du texte pour les badges de type
   * @param type - Le type du Pokémon
   * @returns 'black' ou 'white' selon le contraste nécessaire avec la couleur du badge
   */
  abstract getChipTextColor(type: string): "black" | "white";
}
