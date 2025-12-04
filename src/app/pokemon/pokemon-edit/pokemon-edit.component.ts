import { Pokemon } from './../../pokemon.model';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Pokemonservice } from '../../services/pokemon.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getPokemonColor, POKEMON_RULES } from '../../pokemon.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';

/**
 * Composant d'édition d'un Pokémon avec formulaire réactif
 *
 * Ce composant permet de modifier toutes les propriétés d'un Pokémon:
 * - Nom (avec validation de pattern, longueur min/max)
 * - Points de vie (avec incrémentation/décrémentation)
 * - Dégâts (avec incrémentation/décrémentation)
 * - Types (sélection multiple avec checkboxes, min 1 max 3)
 *
 * Utilise les FormGroups Angular pour la validation et la gestion du formulaire.
 * Route associée: /pokemons/edit/:id
 */
@Component({
  selector: 'app-pokemon-edit',
  standalone: true,
  imports: [ RouterLink, ReactiveFormsModule, ],
  templateUrl: './pokemon-edit.component.html',
  styles: ``,
})
export class PokemonEditComponent {
   // Injection du service de routage pour récupérer l'ID du Pokémon depuis l'URL
  readonly #route = inject(ActivatedRoute);

  readonly #router = inject(Router);

  // Injection du service Pokémon pour accéder aux données et méthodes utilitaires
  readonly pokemonService = inject(Pokemonservice);

  readonly #pokemonId = signal(Number(this.#route.snapshot.paramMap.get('id')));

  readonly #pokemonResponse = toSignal(
    this.pokemonService.getPokemonById(this.#pokemonId()).pipe(
      map((pokemon) => ({ value: pokemon , error: undefined })),
      catchError((error) => of({ value: undefined, error: error }))
    )
  );

  readonly loading = computed(() => this.#pokemonResponse() ===undefined);
  readonly error = computed(() => this.#pokemonResponse()?.error);
  readonly pokemon = computed(() => this.#pokemonResponse()?.value);

  /**
   * Obtient la couleur hexadécimale associée à un type de Pokémon
   */
  getPokemonColor(type: string): string {
    return getPokemonColor(type);
  }

  // Référence à la méthode du service pour la couleur du texte des badges
  readonly getchipTextColor = this.pokemonService.getChipTextColor;

  // Expose les règles de validation pour utilisation dans le template
  readonly POKEMON_RULES = POKEMON_RULES;


  /**
   * FormGroup principal du formulaire d'édition
   *
   * Structure du formulaire:
   * - name: FormControl avec validateurs (requis, longueur 3-20, pattern lettres uniquement)
   * - life: FormControl pour les points de vie
   * - damage: FormControl pour les dégâts
   * - type: FormArray pour gérer la sélection multiple de types (min 1, max 3)
   *
   * Les valeurs initiales sont pré-remplies avec les données du Pokémon existant
   */
  readonly form = new FormGroup({
    name: new FormControl("", [
      Validators.required,                              // Le nom est obligatoire
      Validators.minLength(POKEMON_RULES.MIN_NAME),     // Minimum 3 caractères
      Validators.maxLength(POKEMON_RULES.MAX_NAME),     // Maximum 20 caractères
      Validators.pattern(POKEMON_RULES.NAME_PATTERN),   // Uniquement des lettres
    ]),
    life: new FormControl(),
    damage: new FormControl(),
    type: new FormArray(
      // Transforme le tableau de types en tableau de FormControls
      [],
      [ Validators.required, Validators.maxLength(POKEMON_RULES.MAX_TYPES)]
    ),
  });

  constructor() {
    effect(() => {
      const pokemon = this.pokemon();

      if(pokemon) {
        this.form.patchValue({
          name: pokemon.name,
          life: pokemon.life,
          damage: pokemon.damage,
        });

        pokemon.types.forEach((type) =>
          this.pokemonTypeList.push(new FormControl(type))
        );
      }
    });
  }

  /**
   * Getter pour accéder facilement au FormArray des types
   * @returns Le FormArray contenant les types sélectionnés
   */
  get pokemonTypeList(): FormArray {
    return this.form.get('type') as FormArray;
  }

  /**
   * Getter pour accéder au FormControl du nom
   * @returns Le FormControl du champ nom
   */
  get pokemonName(): FormControl {
    return this.form.get('name') as FormControl;
  }

  /**
   * Getter pour accéder au FormControl des points de vie
   * @returns Le FormControl du champ life
   */
  get PokemonLife(): FormControl {
    return this.form.get('life') as FormControl;
  }

  /**
   * Getter pour accéder au FormControl des dégâts
   * @returns Le FormControl du champ damage
   */
  get PokemonDamage(): FormControl {
    return this.form.get('damage') as FormControl
  }


  /**
   * Augmente les points de vie du Pokémon de 1
   * Modifie directement la valeur du FormControl
   */
  incrementLife() {
    const newvalue = this.PokemonLife.value + 1;
    this.PokemonLife.setValue(newvalue);
  }

  /**
   * Diminue les points de vie du Pokémon de 1
   * Modifie directement la valeur du FormControl
   */
  decrementLife() {
    const newvalue = this.PokemonLife.value - 1;
    this.PokemonLife.setValue(newvalue);
  }

  /**
   * Augmente les dégâts du Pokémon de 1
   * Modifie directement la valeur du FormControl
   */
  incrementDamage() {
    const newvalue = this.PokemonDamage.value +1 ;
    this.PokemonDamage.setValue(newvalue);
  }

  /**
   * Diminue les dégâts du Pokémon de 1
   * Modifie directement la valeur du FormControl
   */
  decrementDamage() {
    const newvalue = this.PokemonDamage.value - 1;
    this.PokemonDamage.setValue(newvalue);
  }


  /**
   * Vérifie si un type est actuellement sélectionné pour le Pokémon
   *
   * @param type - Le type à vérifier (ex: 'Feu', 'Eau')
   * @returns true si le type est sélectionné, false sinon
   *
   * Utilisé dans le template pour cocher/décocher les checkboxes
   */
  isPokemeonTypeSelected(type: string): boolean {
    return !!this.pokemonTypeList.controls.find(
      (control) => control.value === type
    );
  }

  /**
   * Gère l'ajout ou la suppression d'un type lors du clic sur une checkbox
   *
   * @param type - Le type concerné par le changement
   * @param isChecked - true si la checkbox a été cochée, false si décochée
   *
   * Si coché: ajoute un nouveau FormControl avec le type au FormArray
   * Si décoché: trouve et supprime le FormControl correspondant du FormArray
   */
  onPokemonTypeChange(type: string, isChecked: boolean) {
    if (isChecked) {
      const control = new FormControl(type);
      this.pokemonTypeList.push(control);
    } else {
      const index = this.pokemonTypeList.controls
        .map((control) => control.value)
        .indexOf(type);

      this.pokemonTypeList.removeAt(index);
    }
  }

  /**
   * Méthode appelée lors de la soumission du formulaire
   *
   * Pour l'instant, affiche simplement les valeurs du formulaire dans la console.
   * En production, cette méthode appellerait une API pour sauvegarder les modifications.
   */
  onSubmit() {
      const isFormValid = this.form.valid;
      const pokemon = this.pokemon();

      if (isFormValid && pokemon) {
        const updatePokemon = {
          ...pokemon,
          name: this.pokemonName.value,
          life: this.PokemonLife.value,
          damage: this.PokemonDamage.value,
          types: this.pokemonTypeList.value,
        };

        this.pokemonService.updatePokemon(updatePokemon).subscribe(() => {
          this.#router.navigate(['/pokemons', pokemon.id]);
        });
    }
  }
}
