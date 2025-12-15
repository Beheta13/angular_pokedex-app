/**
 * Interface représentant la structure d'un Pokémon
 *
 * Cette interface définit le contrat que tous les objets Pokémon doivent respecter.
 */
export interface Pokemon {
  id: number;           // Identifiant unique du Pokémon
  name: string;         // Nom du Pokémon (ex: "Pikachu")
  picture: string;      // URL de l'image du Pokémon
  life: number;         // Points de vie (HP) du Pokémon
  damage: number;       // Points de dégâts d'attaque
  types: [string] | [string, string] | [string, string, string];  // Types du Pokémon (minimum 1, maximum 3)
  created: Date;        // Date de création/ajout du Pokémon
}

/**
 * Règles de validation pour les propriétés des Pokémons
 *
 * Ces constantes sont utilisées dans les formulaires de création/édition
 * pour valider les données saisies par l'utilisateur.
 * Le 'as const' garantit que ces valeurs sont immuables.
 */
export const POKEMON_RULES = {
  NAME_PATTERN: /^[a-zA-Zéè]+$/,  // Pattern regex: uniquement des lettres (avec accents)
  MAX_NAME: 20,                    // Longueur maximale du nom
  MIN_NAME: 3,                     // Longueur minimale du nom
  MAX_LIFE: 30,                    // Points de vie maximum
  HIGH_LIFE: 25,                   // Seuil pour considérer un Pokémon comme "fort"
  LOW_LIFE: 15,                    // Seuil pour considérer un Pokémon comme "faible"
  MIN_LIFE: 10,                    // Points de vie minimum
  MAX_DAMAGE: 10,                  // Dégâts maximum
  MIN_DAMAGE: 1,                   // Dégâts minimum
  MIN_TYPES: 1,                    // Nombre minimum de types requis
  MAX_TYPES: 3,                    // Nombre maximum de types autorisés
} as const;

/**
 * Fonction utilitaire pour obtenir la couleur associée à un type de Pokémon
 *
 * Cette fonction est utilisée pour styliser l'interface utilisateur (bordures,
 * badges, etc.) en fonction du type du Pokémon.
 *
 * @param type - Le type du Pokémon (Feu, Eau, Plante, etc.)
 * @returns Un code couleur hexadécimal correspondant au type
 *
 * Exemple d'utilisation:
 * getPokemonColor('Feu') // retourne '#EF5350' (rouge)
 */
export function getPokemonColor(type: string): string {
    switch (type) {
      case 'Feu':
        return '#EF5350';      // Rouge pour le feu
      case 'Eau':
        return '#42A5F5';      // Bleu pour l'eau
      case 'Plante':
        return '#66BB6A';      // Vert pour les plantes
      case 'Insecte':
        return '#8d6e63';      // Marron pour les insectes
      case 'Vol':
        return '#90CAF9';      // Bleu clair pour le vol
      case 'Poison':
        return '#b388ff';      // Violet pour le poison
      case 'Fée':
        return '#f8bbd0';      // Rose pour les fées
      case 'Electrik':
        return '#f4ff81';      // Jaune pour l'électricité
      default:
        return '#303030';      // Gris foncé par défaut
    }
}

/**
 * Type alias pour un tableau de Pokémons
 *
 * Facilite la lecture du code en utilisant 'PokemonList' au lieu de 'Pokemon[]'
 */
export type PokemonList = Pokemon[];
