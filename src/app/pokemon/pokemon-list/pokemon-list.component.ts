import { Component, signal, computed, inject, linkedSignal } from '@angular/core';
import { Pokemon, PokemonList } from '../../pokemon.model';
import { PokemanBorder } from '../../pokeman-border.directive';
import { DatePipe, NgClass } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { httpResource } from '@angular/common/http';

/**
 * Composant affichant la liste complète des Pokémons avec recherche et filtrage
 *
 * Ce composant présente tous les Pokémons sous forme de grille avec :
 * - Une barre de recherche pour filtrer par nom
 * - Un système de filtrage par type de Pokémon (boutons cliquables)
 * - Des cartes Pokémon cliquables menant au profil détaillé
 * - Des informations de base (nom, image, types, points de vie, date)
 * - Possibilité de supprimer un Pokémon de l'affichage
 *
 * Utilise les signaux Angular (signals, computed, linkedSignal) pour la réactivité automatique.
 * Route associée: /pokemons
 */
@Component({
  selector: 'app-pokemon-list',
  imports: [PokemanBorder, DatePipe, RouterLink],
  templateUrl: './pokemon-list.component.html',
  styles: `.pokemon-card { cursor: pointer; }`,
})
export class PokemonListComponent {
  /**
   * Injection du service Pokémon
   *
   * Le service est injecté et exposé publiquement (sans #) pour permettre
   * son utilisation dans le template HTML si nécessaire.
   *
   * inject() est la nouvelle API d'injection Angular (alternative au constructeur)
   */
  readonly pokemonService = inject(PokemonService);

  /**
   * Resource HTTP retournée par le service PokemonService
   *
   * Cette resource est créée par httpResource() dans le service et contient :
   * - .value() : La liste des Pokémons (Signal)
   * - .isLoading() : État de chargement (Signal booléen)
   * - .update() : Méthode pour modifier la valeur en cache
   * - .hasValue() : Vérifie si des données ont été chargées
   * - .error() : Contient l'erreur éventuelle
   *
   * Avantages de déléguer httpResource au service :
   * - Séparation des responsabilités (service = logique métier)
   * - Réutilisabilité du service dans d'autres composants
   * - Centralisation de l'URL de l'API
   * - Facilite les tests unitaires (mock du service)
   */
  readonly pokemonListResource = this.pokemonService.getPokemonList();

  /**
   * Signal calculé indiquant si les données sont en cours de chargement
   *
   * Utilise la méthode .isLoading() fournie par httpResource
   * pour détecter automatiquement l'état de chargement de la requête HTTP.
   *
   * @returns true si la requête HTTP est en cours, false sinon
   */
  readonly loading = computed(() => this.pokemonListResource.isLoading());

  /**
   * Signal modifiable contenant la liste des Pokémons
   *
   * Initialisé comme tableau vide, puis rempli via l'Observable du service.
   * Signal modifiable (signal<T>) au lieu de toSignal() pour permettre les
   * modifications locales (ajout/suppression) via .set() et .update()
   */

  /**
   * Signal contenant le terme de recherche saisi par l'utilisateur
   * Utilisé pour filtrer la liste des Pokémons par nom
   */
  readonly searchTerm = signal('');

  /**
   * Signal calculé retournant la liste unique de tous les types disponibles
   *
   * Extrait tous les types de tous les Pokémons avec flatMap(),
   * puis élimine les doublons avec new Set().
   * Se recalcule automatiquement quand pokemonList change.
   *
   * @returns Tableau des types uniques (ex: ['Feu', 'Eau', 'Plante', ...])
   */
  readonly typeList = computed(() => {
    // Accède à la valeur actuelle de la resource avec .value()
    // flatMap() aplatit tous les tableaux de types en un seul tableau
    const allTypes = this.pokemonListResource.value()?.flatMap((pokemon) => pokemon.types);
    // new Set() élimine les doublons, [...] convertit le Set en tableau
    return [...new Set(allTypes)];
  });

  /**
   * Signal lié (linkedSignal) qui maintient le type sélectionné pour le filtrage
   *
   * Caractéristiques :
   * - Se synchronise automatiquement avec typeList (source)
   * - Se réinitialise si le type sélectionné disparaît de la liste
   * - Conserve le type sélectionné s'il existe toujours
   * - Retourne le premier type si le type précédent n'existe plus
   *
   * @returns string (type sélectionné) ou null (aucun filtre)
   */
  readonly typeSelected = linkedSignal<string[], string|null>({
    source: this.typeList,
    computation: (newTypeList, previous) => {
      // Si la liste des types est vide, aucun type ne peut être sélectionné
      const isTypeListEmpty = newTypeList.length === 0;
      if (isTypeListEmpty) {
        return null;
      }

      // Au premier chargement (pas de valeur précédente), aucun filtre par défaut
      if(!previous?.value) {
        return null;
      }

      // Vérifie si le type précédemment sélectionné existe toujours dans la liste
      const isPreviousTypeSelectedValid = !!newTypeList.find(type => type === previous.value);

      // Si le type précédent existe toujours, on le conserve
      if(isPreviousTypeSelectedValid) {
        return previous.value;
      }

      // Sinon, sélectionne le premier type disponible
      return null;
    }
  });

  /**
   * Signal calculé qui filtre automatiquement la liste des Pokémons
   * selon le terme de recherche ET le type sélectionné
   *
   * Double filtrage :
   * 1. Par nom : insensible à la casse, ignore les espaces
   * 2. Par type : si un type est sélectionné, affiche seulement les Pokémons de ce type
   *
   * Se recalcule automatiquement dès que searchTerm, pokemonList ou typeSelected change.
   *
   * @returns Liste des Pokémons correspondant aux critères de filtrage
   */
  readonly pokemonListFiltered = computed(() => {
    const searchTerm = this.searchTerm();
    // .value() récupère le tableau de Pokémons depuis la resource
    const pokemonList = this.pokemonListResource.value();

    return pokemonList
      // Filtre 1 : Par nom (toLowerCase pour insensibilité à la casse)
      .filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
      // Filtre 2 : Par type (si un type est sélectionné)
      .filter((pokemon) => {
        const typeSelected = this.typeSelected();
        // Si aucun type sélectionné, affiche tous les Pokémons
        if (!typeSelected) {
          return true;
        }
        // Vérifie si le Pokémon possède le type sélectionné
        return pokemon.types.includes(typeSelected);
      });
  });

  /**
   * Toggle le filtre par type de Pokémon
   *
   * Si le type cliqué est déjà sélectionné : le désélectionne (affiche tous)
   * Sinon : sélectionne le type cliqué (filtre la liste)
   *
   * @param type - Le type de Pokémon à filtrer (ex: 'Feu', 'Eau')
   */
  filterByType(type: string): void {
    const newType = this.typeSelected() === type ? null : type;
    this.typeSelected.set(newType);
  }

  /**
   * Supprime un Pokémon de la liste locale (interface)
   *
   * IMPORTANT : Cette méthode ne supprime PAS le Pokémon de l'API,
   * seulement de l'affichage local.
   *
   * Utilise la méthode .update() de httpResource pour modifier la valeur
   * en cache sans re-fetch depuis l'API (mise à jour optimiste).
   *
   * C'est plus performant que de recharger toute la liste depuis l'API.
   *
   * Pour supprimer réellement de l'API, il faudrait appeler :
   * this.pokemonService.deletePokemon(pokemon.id).subscribe()
   *
   * @param pokemon - Le Pokémon à retirer de l'affichage
   */
  removePokemon(pokemon: Pokemon): void {
    // .update() modifie la valeur en cache de la resource
    this.pokemonListResource.update((pokemonList) => {
      // Filtre le Pokémon par son ID (déstructuration {id})
      return pokemonList.filter(({id}) => id !== pokemon.id);
    });
  }



  /**
   * Détermine la taille d'un Pokémon en fonction de ses points de vie
   *
   * @param pokemon - Le Pokémon à évaluer
   * @returns 'Petit' si <= 15 HP, 'Grand' si >= 25 HP, 'Moyen' sinon
   */
  size (pokemon: Pokemon) {
    if (pokemon.life <= 15) {
      return 'Petit';
    }

    if (pokemon.life >=25) {
      return 'Grand';
    }

    return 'Moyen';
  };

}

