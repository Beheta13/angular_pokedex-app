import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

/**
 * Composant racine de l'application Pokédex
 *
 * Ce composant sert de point d'entrée principal de l'application.
 * Il contient le RouterOutlet qui permet d'afficher les différentes pages
 * de l'application en fonction de la route active.
 *
 * Imports utilisés:
 * - RouterOutlet : Affiche le composant correspondant à la route active
 * - RouterLink : Permet la navigation entre les différentes pages
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Composant racine sans logique métier - tout est géré par le routeur
}
