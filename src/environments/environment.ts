/**
 * Configuration d'environnement de PRODUCTION
 *
 * Ce fichier est utilisé lors de la compilation de production (ng build --configuration production)
 *
 * Caractéristiques :
 * - production: true → Active le mode production Angular (optimisations, AOT, etc.)
 * - Utilise PokemonLocalStorageService (stockage local dans le navigateur)
 * - Pas besoin de serveur backend
 *
 * Pour utiliser JSON Server en production, changez production: false
 */
export const environment = {
  production: true,
};
