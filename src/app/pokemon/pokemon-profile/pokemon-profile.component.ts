import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Pokemonservice } from '../../services/pokemon.service';
import { DatePipe } from '@angular/common';
import { getPokemonColor } from '../../pokemon.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';

/**
 * Composant affichant le profil détaillé d'un Pokémon spécifique
 *
 * Ce composant récupère l'ID du Pokémon depuis l'URL et affiche:
 * - L'image du Pokémon
 * - Son nom et tous ses attributs (vie, dégâts, types)
 * - La date de création
 * - Un bouton pour éditer le Pokémon
 * - Un bouton de retour vers la liste
 *
 * Route associée: /pokemons/:id
 */
@Component({
  selector: 'app-pokemon-profile',
  imports: [RouterLink, DatePipe],
  templateUrl: './pokemon-profile.component.html',
  styles: ``,
})
export class PokemonProfileComponent {

  // Injection du service de routage pour accéder aux paramètres d'URL
  readonly #route = inject(ActivatedRoute);

  readonly #router = inject(Router);

  // Injection du service Pokémon pour récupérer les données
  readonly #pokemonService = inject(Pokemonservice);

  // Référence à la méthode du service pour déterminer la couleur du texte des badges
  readonly getchipTextColor = this.#pokemonService.getChipTextColor;

  // Récupère l'ID du Pokémon depuis l'URL (ex: /pokemons/5 -> pokemonId = 5)
  readonly #pokemonId = Number(this.#route.snapshot.paramMap.get('id'));


  readonly #pokemonResponse = toSignal(
    this.#pokemonService.getPokemonById(this.#pokemonId).pipe(
      map((pokemon) => ({ value: pokemon , error: undefined })),
      catchError((error) => of({ value: undefined, error: error }))
    )
  );

  readonly loading = computed(() => this.#pokemonResponse() ===undefined);
  readonly error = computed(() => this.#pokemonResponse()?.error);
  readonly pokemon = computed(() => this.#pokemonResponse()?.value);

  deletePokemon() {
    this.#pokemonService.deletePokemon(this.#pokemonId).subscribe(() => {
      this.#router.navigate(['/pokemons']);
    });
  }



  /**
   * Obtient la couleur associée à un type de Pokémon
   *
   * @param type - Le type du Pokémon
   * @returns Le code couleur hexadécimal correspondant
   */
  getPokemonColor(type: string): string {
    return getPokemonColor(type);
  }


}
