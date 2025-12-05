import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getPokemonColor, Pokemon, POKEMON_RULES } from '../../pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { Router, RouterLink } from '@angular/router';

/**
 * Composant de création d'un nouveau Pokémon avec formulaire réactif
 *
 * Ce composant permet d'ajouter un nouveau Pokémon à la collection avec :
 * - Nom (avec validation de pattern, longueur min/max)
 * - URL de l'image (obligatoire)
 * - Points de vie initiaux (avec incrémentation/décrémentation, défaut: 10)
 * - Dégâts initiaux (avec incrémentation/décrémentation, défaut: 1)
 * - Types (sélection multiple avec checkboxes, min 1 max 3, défaut: Normal)
 *
 * Route associée: /pokemons/add
 */
@Component({
  selector: 'app-pokemon-add',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './pokemon-add.component.html',
  styles: ``
})
export class PokemonAddComponent {
  // Injection du routeur pour rediriger après création
  readonly router = inject(Router);

  // Injection du service Pokémon pour créer le nouveau Pokémon
  readonly pokemonService = inject(PokemonService);

  // Expose les règles de validation comme signal en lecture seule pour le template
  readonly POKEMON_RULES = signal(POKEMON_RULES).asReadonly();

  /**
   * FormGroup principal du formulaire de création
   *
   * Structure du formulaire avec valeurs par défaut :
   * - name: '' (vide) avec validateurs (requis, longueur 3-20, pattern lettres uniquement)
   * - picture: '' (vide) obligatoire - URL de l'image du Pokémon
   * - life: 10 (valeur par défaut) - Points de vie initiaux
   * - damage: 1 (valeur par défaut) - Dégâts initiaux
   * - types: ['Normal'] (valeur par défaut) - FormArray avec minimum 1, maximum 3 types
   */
  readonly form = new FormGroup({
    name: new FormControl('', [
      Validators.required,                              // Le nom est obligatoire
      Validators.minLength(POKEMON_RULES.MIN_NAME),     // Minimum 3 caractères
      Validators.maxLength(POKEMON_RULES.MAX_NAME),     // Maximum 20 caractères
      Validators.pattern(POKEMON_RULES.NAME_PATTERN),   // Uniquement des lettres
    ]),
    picture: new FormControl('', [Validators.required]), // URL de l'image obligatoire
    life: new FormControl(10),                           // Points de vie par défaut: 10
    damage: new FormControl(1),                          // Dégâts par défaut: 1
    types: new FormArray(
      [new FormControl('Normal')],                       // Type par défaut: Normal
      [Validators.required, Validators.maxLength(3)]     // Min 1, Max 3 types
    ),
  });

  /**
   * Méthode appelée lors de la soumission du formulaire de création
   *
   * Vérifie la validité du formulaire, construit un nouvel objet Pokémon
   * avec les valeurs saisies, envoie la requête POST à l'API et redirige
   * vers la page de profil du Pokémon nouvellement créé.
   *
   * markAsDirty() force l'affichage des messages d'erreur même si les champs
   * n'ont pas été touchés par l'utilisateur.
   */
  onSubmit() {
    // Marque tous les champs comme "touchés" pour afficher les erreurs de validation
    Object.values(this.form.controls).forEach(control => control.markAsDirty());

    // Si le formulaire n'est pas valide, arrête la soumission
    if(this.form.invalid) {
      return;
    }

    // Construit l'objet Pokémon à créer (sans l'ID qui sera généré par l'API)
    // Omit<Pokemon, 'id'> signifie : tous les champs de Pokemon sauf 'id'
    const pokemon: Omit<Pokemon, 'id'> = {
      name: this.pokemonName.value,
      picture: this.pokemonPicture.value,
      life: this.pokemonLife.value,
      damage: this.pokemonDamage.value,
      // Transforme le FormArray en tableau de strings pour le type
      types: this.pokemonTypeList.controls.map(control => control.value) as [string, string?, string?],
      created: new Date()  // Date de création actuelle
    };

    // Envoie la requête POST et redirige vers le profil après succès
    this.pokemonService.addPokemon(pokemon).subscribe((pokemonAdded) => {
      this.router.navigate(['/pokemons', pokemonAdded.id]);
    });
  }

  /**
   * Getter pour accéder au FormControl de l'image
   * @returns Le FormControl du champ picture
   */
  get pokemonPicture() {
    return this.form.get('picture') as FormControl;
  }

  /**
   * Getter pour accéder au FormControl du nom
   * @returns Le FormControl du champ name
   */
  get pokemonName() {
    return this.form.get('name') as FormControl;
  }

  /**
   * Getter pour accéder au FormControl des points de vie
   * @returns Le FormControl du champ life
   */
  get pokemonLife() {
    return this.form.get('life') as FormControl;
  }

  /**
   * Getter pour accéder au FormControl des dégâts
   * @returns Le FormControl du champ damage
   */
  get pokemonDamage() {
    return this.form.get('damage') as FormControl;
  }

  /**
   * Getter pour accéder au FormArray des types
   * @returns Le FormArray contenant les types sélectionnés
   */
  get pokemonTypeList() {
    return this.form.get('types') as FormArray;
  }

  /**
   * Obtient la couleur hexadécimale associée à un type de Pokémon
   * Utilisé pour styliser les badges de type dans le template
   *
   * @param type - Le type du Pokémon
   * @returns Le code couleur hexadécimal correspondant
   */
  getPokemonColor(type: string) {
    return getPokemonColor(type);
  }

  /**
   * Augmente les points de vie du Pokémon de 1
   * Modifie directement la valeur du FormControl
   */
  incrementLife() {
    const newValue = this.pokemonLife.value + 1;
    this.pokemonLife.setValue(newValue);
  }

  /**
   * Diminue les points de vie du Pokémon de 1
   * Modifie directement la valeur du FormControl
   */
  decrementLife() {
    const newValue = this.pokemonLife.value - 1;
    this.pokemonLife.setValue(newValue);
  }

  /**
   * Augmente les dégâts du Pokémon de 1
   * Modifie directement la valeur du FormControl
   */
  incrementDamage() {
    const newValue = this.pokemonDamage.value + 1;
    this.pokemonDamage.setValue(newValue);
  }

  /**
   * Diminue les dégâts du Pokémon de 1
   * Modifie directement la valeur du FormControl
   */
  decrementDamage() {
    const newValue = this.pokemonDamage.value - 1;
    this.pokemonDamage.setValue(newValue);
  }

  /**
   * Vérifie si un type est actuellement sélectionné pour le Pokémon
   *
   * @param type - Le type à vérifier (ex: 'Feu', 'Eau')
   * @returns true si le type est sélectionné, false sinon
   *
   * Utilisé dans le template pour cocher/décocher les checkboxes
   */
  isPokemonTypeSelected(type: string) {
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
      // Ajoute un nouveau FormControl avec le type sélectionné
      const control = new FormControl(type);
      this.pokemonTypeList.push(control);
    } else {
      // Trouve l'index du type à supprimer et le retire du FormArray
      const index = this.pokemonTypeList.controls
        .map((control) => control.value)
        .indexOf(type);
      this.pokemonTypeList.removeAt(index);
    }
  }
}
