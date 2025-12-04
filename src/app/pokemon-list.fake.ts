import { PokemonList } from './pokemon.model';

/**
 * Données fictives de test pour le Pokédex
 *
 * Cette liste contient des Pokémons pré-configurés utilisés pour le développement
 * et les tests de l'application. En production, ces données seraient remplacées
 * par des données provenant d'une API backend.
 *
 * Contient 12 Pokémons de la première génération avec leurs caractéristiques:
 * - ID, nom, points de vie, dégâts, types, image et date de création
 */
export const POKEMON_LIST: PokemonList = [
  {
    id: 1,
    name: 'Bulbizarre',
    life: 25,
    damage: 5,
    picture:
      'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png',
    types: ['Plante', 'Poison'],
    created: new Date(),
  },
  {
    id: 2,
    name: 'Salamèche',
    life: 28,
    damage: 6,
    picture:
      'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/004.png',
    types: ['Feu'],
    created: new Date(),
  },
  {
    id: 3,
    name: 'Carapuce',
    life: 21,
    damage: 4,
    picture:
      'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/007.png',
    types: ['Eau'],
    created: new Date(),
  },
  {
    id: 4,
    name: 'Aspicot',
    life: 16,
    damage: 2,
    picture:
      'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/013.png',
    types: ['Insecte', 'Poison'],
    created: new Date(),
  },
  {
    id: 5,
    name: 'Roucool',
    life: 30,
    damage: 7,
    picture:
      'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/016.png',
    types: ['Normal', 'Vol'],
    created: new Date(),
  },
  {
    id: 6,
    name: 'Rattata',
    life: 18,
    damage: 6,
    picture:
      'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/019.png',
    types: ['Normal'],
    created: new Date(),
  },
  {
    id: 7,
    name: 'Piafabec',
    life: 14,
    damage: 5,
    picture:
      'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/021.png',
    types: ['Normal', 'Vol'],
    created: new Date(),
  },
  {
    id: 8,
    name: 'Abo',
    life: 16,
    damage: 4,
    picture:
      'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/023.png',
    types: ['Poison'],
    created: new Date(),
  },
  {
    id: 9,
    name: 'Pikachu',
    life: 21,
    damage: 7,
    picture:
      'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/025.png',
    types: ['Electrik'],
    created: new Date(),
  },
  {
    id: 10,
    name: 'Sabelette',
    life: 19,
    damage: 3,
    picture:
      'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/027.png',
    types: ['Normal'],
    created: new Date(),
  },
  {
    id: 11,
    name: 'Mélofée',
    life: 25,
    damage: 5,
    picture:
      'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/035.png',
    types: ['Fée'],
    created: new Date(),
  },
  {
    id: 12,
    name: 'Groupix',
    life: 17,
    damage: 8,
    picture:
      'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/037.png',
    types: ['Feu'],
    created: new Date(),
  },
];

