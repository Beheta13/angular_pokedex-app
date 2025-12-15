import { inject, Signal, signal } from '@angular/core';
import { Pokemon, PokemonList } from '../pokemon.model';
import { HttpClient, HttpRequest, httpResource, HttpResourceRef } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { PokemonService } from './pokemon.service';

/**
 * Implémentation du service Pokémon utilisant JSON Server comme backend
 *
 * Cette classe implémente l'interface PokemonService et communique
 * avec une API REST simulée (JSON Server sur localhost:3000).
 *
 * Utilisé pour le développement et les tests.
 * En production, remplacez ce service par une vraie API backend.
 */
export class PokemonJSONServerService implements PokemonService {
  // Injection du client HTTP pour les requêtes API
  private readonly http = inject(HttpClient);

  // URL de base de l'API JSON Server
  private readonly POKEMON_API_URL = 'http://localhost:3000/pokemons';

  /**
   * Récupère la liste complète de tous les Pokémons depuis l'API
   *
   * Retourne une HttpResourceRef au lieu d'un Observable classique.
   * Cette nouvelle API Angular simplifie la gestion des requêtes HTTP :
   *
   * @returns HttpResourceRef<PokemonList> - Resource HTTP avec :
   *   - .value() : Signal contenant le tableau de Pokémons
   *   - .isLoading() : Signal booléen indiquant le chargement
   *   - .update() : Méthode pour modifier la valeur en cache
   *   - .hasValue() : Vérifie si des données sont disponibles
   *   - .error() : Signal contenant l'erreur éventuelle
   *
   * Configuration :
   * - url : L'URL de l'API REST (fonction pour permettre les URLs dynamiques)
   * - defaultValue : Valeur par défaut (tableau vide) pendant le chargement
   *
   * Avantages de httpResource vs http.get() :
   * - Gestion automatique des états (chargement, succès, erreur)
   * - Intégration native avec les Signals
   * - Mise à jour optimiste possible avec .update()
   * - Pas besoin de gérer manuellement les souscriptions
   */
  getPokemonList(): HttpResourceRef<PokemonList> {
    return httpResource<PokemonList>(
      // Fonction retournant la configuration de la requête
      () => this.POKEMON_API_URL,
      // Options : valeur par défaut pendant le chargement
      { defaultValue: [] }
    );
  }

  /**
   * Récupère un Pokémon spécifique par son ID
   *
   * @param id - L'identifiant unique du Pokémon
   * @returns Observable contenant le Pokémon correspondant
   */
  getPokemonById(id: Signal<number>): HttpResourceRef<Pokemon|undefined> {
    return httpResource<Pokemon>(() => {
      if (!id()){
        return undefined
      }

      return `${this.POKEMON_API_URL}/${id()}`;
    });
  }

  /**
   * Met à jour un Pokémon existant dans l'API
   *
   * @param pokemon - Le Pokémon avec les modifications à sauvegarder
   * @returns Observable contenant le Pokémon mis à jour
   *
   * Effectue une requête HTTP PUT vers /pokemons/:id
   */
  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    return this.http.put<Pokemon>(
      `${this.POKEMON_API_URL}/${pokemon.id}`,
      pokemon
    );
  }

  /**
   * Supprime un Pokémon de l'API
   *
   * @param pokemonId - L'identifiant du Pokémon à supprimer
   * @returns Observable vide confirmant la suppression
   *
   * Effectue une requête HTTP DELETE vers /pokemons/:id
   */
  deletePokemon(pokemonId: number): Observable<void> {
    return this.http.delete<void>(`${this.POKEMON_API_URL}/${pokemonId}`);
  }

  /**
   * Ajoute un nouveau Pokémon dans l'API
   *
   * @param pokemon - Les données du nouveau Pokémon (sans l'ID)
   * @returns Observable contenant le Pokémon créé avec son ID généré
   *
   * Effectue une requête HTTP POST vers /pokemons
   * L'API génère automatiquement l'ID du nouveau Pokémon
   */
  addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon> {
    return this.http.post<Pokemon>(this.POKEMON_API_URL, pokemon);
  }

  /**
   * Détermine la couleur du texte pour les badges de type
   *
   * @param type - Le type du Pokémon
   * @returns 'black' pour le type Electrik (fond jaune), 'white' pour les autres
   *
   * Assure une bonne lisibilité du texte sur les badges colorés
   */
  getChipTextColor(type: string): "black" | "white" {
    return type === 'Electrik' ? 'black' : 'white';
  }

  /**
   * Retourne la liste de tous les types de Pokémons disponibles
   *
   * @returns Tableau contenant tous les types possibles
   *
   * Utilisé dans les formulaires pour afficher les options de sélection
   */
  getPokemonTypeList(): string[] {
    return [
      'Plante',
      'Feu',
      'Eau',
      'Insecte',
      'Normal',
      'Electrik',
      'Poison',
      'Fée',
      'Vol',
    ];
  }
}
