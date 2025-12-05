import { Injectable, signal } from "@angular/core";
import { delay, Observable, of } from "rxjs";

/**
 * Service d'authentification de l'application
 *
 * Gère l'état de connexion de l'utilisateur et fournit une méthode
 * de connexion simulée (pour le développement).
 *
 * En production, ce service communiquerait avec une vraie API backend
 * pour vérifier les identifiants et gérer les tokens JWT.
 *
 * @Injectable avec 'root' : Service singleton partagé dans toute l'application
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal privé pour gérer l'état de connexion (modifiable uniquement dans ce service)
  readonly #isLoggedIn = signal(false);

  // Signal public en lecture seule exposé aux composants
  readonly isLoggedIn = this.#isLoggedIn.asReadonly();

  /**
   * Tente de connecter un utilisateur avec les identifiants fournis
   *
   * @param name - Le nom d'utilisateur
   * @param password - Le mot de passe
   * @returns Un Observable<boolean> indiquant si la connexion a réussi
   *
   * Simulation actuelle : accepte uniquement "Pikachu" / "Pikachu#"
   * Le delay de 1000ms simule un appel réseau
   */
  login(name: string, password: string): Observable<boolean> {
    const isLoggedIn = name ==="Pikachu" && password === "Pikachu#";

    this.#isLoggedIn.set(isLoggedIn);
    return of(isLoggedIn).pipe(delay(1000));
  }
}
