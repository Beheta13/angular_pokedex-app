/**
 * Configuration d'environnement de DÉVELOPPEMENT
 *
 * Ce fichier est utilisé par défaut lors du développement (ng serve)
 *
 * Caractéristiques :
 * - production: false → Active le mode développement Angular (source maps, debug, etc.)
 * - Utilise PokemonJSONServerService (API REST sur localhost:3000)
 * - Nécessite de démarrer JSON Server : npm run start:api
 *
 * Pour démarrer l'application :
 * 1. Terminal 1 : npm run start:api (démarre JSON Server)
 * 2. Terminal 2 : ng serve (démarre Angular)
 */
export const environment = {
  production: false,
};
