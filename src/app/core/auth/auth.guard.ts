import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivateFn, Router } from "@angular/router";

/**
 * Guard d'authentification pour protéger les routes
 *
 * Ce guard vérifie si l'utilisateur est connecté avant d'autoriser
 * l'accès à une route protégée.
 *
 * Utilisation dans app.config.ts :
 * { path: 'pokemons', component: PokemonListComponent, canActivate: [AuthGuard] }
 *
 * @returns true si l'utilisateur est connecté (accès autorisé)
 * @returns false si l'utilisateur n'est pas connecté (redirige vers /login)
 */
export const AuthGuard: CanActivateFn = () => {
  // Injection du service d'authentification pour vérifier l'état de connexion
  const authService = inject(AuthService);

  // Injection du routeur pour rediriger vers /login si nécessaire
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
}
