// commande pour genérer cette directive :
// ng generate directive pokeman-border --skip-tests

import { Directive, ElementRef, HostListener, input } from '@angular/core';
import { getPokemonColor } from './pokemon.model';

/**
 * Directive personnalisée pour ajouter un effet de bordure colorée aux cartes Pokémon
 *
 * Cette directive change dynamiquement la couleur de la bordure d'un élément
 * en fonction du type du Pokémon lorsque la souris survole l'élément.
 *
 * Utilisation dans le template:
 * <div [appPokemanBorder] [pokemonType]="'Feu'">...</div>
 */
@Directive({
  selector: '[appPokemanBorder]',
})
export class PokemanBorder {
  // Stocke la couleur initiale de la bordure pour la restaurer au mouseLeave
  private initialColor: string;

  // Type du Pokémon - requis pour déterminer la couleur de la bordure
  pokemonType = input.required<string>();

  /**
   * Constructeur de la directive
   *
   * @param el - Référence à l'élément DOM sur lequel la directive est appliquée
   *
   * Initialise la bordure de l'élément avec une largeur de 2px et
   * sauvegarde la couleur initiale pour pouvoir la restaurer plus tard.
   */
  constructor(private el: ElementRef) {
    this.initialColor = this.el.nativeElement.style.borderColor;
    this.el.nativeElement.style.borderWidth = '2px';
   }

   /**
    * Écouteur d'événement déclenché quand la souris entre dans l'élément
    *
    * Change la couleur de la bordure pour correspondre au type du Pokémon
    */
   @HostListener('mouseenter') onMouseEnter() {
    const color = getPokemonColor(this.pokemonType());
    this.setBorder(color);
   }

   /**
    * Écouteur d'événement déclenché quand la souris quitte l'élément
    *
    * Restaure la couleur de bordure initiale
    */
   @HostListener('mouseleave') onMouseLeave() {
    const color = this.initialColor;
    this.setBorder(color);
   }

   /**
    * Méthode privée pour appliquer une couleur à la bordure de l'élément
    *
    * @param color - Code couleur hexadécimal à appliquer
    */
   private setBorder(color: string) {
    this.el.nativeElement.style.borderColor = color;
    }

}
