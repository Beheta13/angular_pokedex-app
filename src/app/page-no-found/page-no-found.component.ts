import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Composant affiché pour les pages non trouvées (erreur 404)
 *
 * Ce composant est activé par la route wildcard '**' définie dans app.config.ts.
 * Il s'affiche quand l'utilisateur tente d'accéder à une URL qui n'existe pas.
 *
 * Contient généralement:
 * - Un message d'erreur 404
 * - Un lien de retour vers la page d'accueil ou la liste des Pokémons
 *
 * Route associée: /** (toutes les routes non définies)
 */
@Component({
  selector: 'app-page-no-found',
  imports: [RouterLink],
  templateUrl: './page-no-found.component.html',
  styles: ``,
})
export class PageNoFoundComponent {
  // Composant simple sans logique - tout est dans le template
}
