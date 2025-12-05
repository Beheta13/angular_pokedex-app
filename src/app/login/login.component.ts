import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { Router } from '@angular/router';

/**
 * Composant de connexion (login) de l'application
 *
 * Ce composant gère l'authentification des utilisateurs avec :
 * - Un formulaire de connexion (nom d'utilisateur et mot de passe)
 * - Des messages d'état (déconnecté, en cours, erreur)
 * - Redirection vers /pokemons après connexion réussie
 *
 * Route associée: /login
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  // Injection du service d'authentification
  private readonly authService = inject(AuthService);

  // Injection du routeur pour la redirection après connexion
  private readonly router = inject(Router);

  // Signal pour le nom d'utilisateur saisi
  readonly name = signal('');

  // Signal pour le mot de passe saisi
  readonly password = signal('');

  // Signal pour le message d'état affiché à l'utilisateur
  readonly message = signal(`Vous êtes déconnecté.`);

  /**
   * Gère la soumission du formulaire de connexion
   *
   * @param event - L'événement de soumission du formulaire
   *
   * Empêche le rechargement de la page, tente la connexion via AuthService,
   * affiche un message d'erreur si échec ou redirige vers /pokemons si succès
   */
  onSubmit(event: Event) {
    event.preventDefault();
    this.message.set('Tentative de connexion en cours ...');

    this.authService
      .login(this.name(), this.password())
      .subscribe((isLoggedIn) => {
        if (!isLoggedIn) {
          this.name.set('');
          this.password.set('');
          this.message.set('Les identifiants saisis sont invalides.');

          return;
        }

        this.router.navigate(['/pokemons']);
      });
  }
}
