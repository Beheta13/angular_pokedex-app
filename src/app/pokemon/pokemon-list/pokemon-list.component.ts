import { Component, signal, computed, inject } from '@angular/core';
import { Pokemon } from '../../pokemon.model';
import { PokemanBorder } from '../../pokeman-border.directive';
import { DatePipe } from '@angular/common';
import { Pokemonservice } from '../../services/pokemon.service';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * Composant affichant la liste complète des Pokémons avec recherche
 *
 * Ce composant présente tous les Pokémons sous forme de grille avec :
 * - Une barre de recherche pour filtrer par nom
 * - Des cartes Pokémon cliquables menant au profil détaillé
 * - Des informations de base (nom, image, types, points de vie)
 * - Des boutons pour incrémenter/décrémenter les points de vie
 *
 * Utilise les signaux Angular pour la réactivité automatique
 */
@Component({
  selector: 'app-pokemon-list',
  imports: [PokemanBorder, DatePipe, RouterLink],
  templateUrl: './pokemon-list.component.html',
  styles: `.pokemon-card { cursor: pointer; }`,
})
export class PokemonListComponent {
  // Injection du service Pokémon (privé avec #)
  readonly #pokemonService = inject(Pokemonservice);

  // Signal contenant la liste complète des Pokémons
  readonly pokemonList = toSignal(this.#pokemonService.getPokemonList(), {
    initialValue: []
  });

  // Signal contenant le terme de recherche saisi par l'utilisateur
  readonly searchTerm = signal('');

  /**
   * Signal calculé qui filtre automatiquement la liste des Pokémons
   * en fonction du terme de recherche
   *
   * Ce computed se recalcule automatiquement dès que searchTerm ou pokemonList change.
   * Le filtrage est insensible à la casse et ignore les espaces.
   */
  readonly pokemonListFiltered = computed(() => {
    const searchTerm = this.searchTerm();
    const pokemonList = this.pokemonList();

    return pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  });

  readonly loading = computed(() => this.pokemonList().length === 0);

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

