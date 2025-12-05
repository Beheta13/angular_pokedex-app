import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
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

  // Injection du routeur pour naviguer après suppression
  readonly #router = inject(Router);

  // Injection du service Pokémon pour récupérer les données
  readonly #pokemonService = inject(PokemonService);

  // Référence à la méthode du service pour déterminer la couleur du texte des badges
  readonly getchipTextColor = this.#pokemonService.getChipTextColor;

  // Récupère l'ID du Pokémon depuis l'URL (ex: /pokemons/5 -> pokemonId = 5)
  readonly #pokemonId = Number(this.#route.snapshot.paramMap.get('id'));

  /**
   * Signal contenant la réponse HTTP du Pokémon avec gestion d'erreur
   *
   * Structure: { value: Pokemon | undefined, error: any | undefined }
   * - value contient le Pokémon si la requête réussit
   * - error contient l'erreur si la requête échoue (404, 500, etc.)
   *
   * toSignal convertit l'Observable HTTP en Signal réactif
   * catchError capture les erreurs HTTP et les transforme en objet avec error
   */
  readonly #pokemonResponse = toSignal(
    this.#pokemonService.getPokemonById(this.#pokemonId).pipe(
      map((pokemon) => ({ value: pokemon , error: undefined })),
      catchError((error) => of({ value: undefined, error: error }))
    )
  );

  // Signal calculé indiquant si les données sont en cours de chargement
  readonly loading = computed(() => this.#pokemonResponse() ===undefined);

  // Signal calculé contenant l'erreur éventuelle (404, erreur réseau, etc.)
  readonly error = computed(() => this.#pokemonResponse()?.error);

  // Signal calculé contenant le Pokémon une fois chargé
  readonly pokemon = computed(() => this.#pokemonResponse()?.value);

  /**
   * Supprime le Pokémon actuellement affiché
   *
   * Envoie une requête DELETE à l'API puis redirige vers la liste
   * des Pokémons après suppression réussie.
   */
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
