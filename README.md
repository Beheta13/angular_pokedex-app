# 🎮 Angular Pokédex App

Application web de gestion de Pokémons développée avec Angular 21+ utilisant les dernières fonctionnalités (Signals, Standalone Components, Control Flow Syntax).

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Architecture du projet](#architecture-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Installation et démarrage](#installation-et-démarrage)
- [Structure du code](#structure-du-code)
- [Concepts Angular utilisés](#concepts-angular-utilisés)

## 🎯 Vue d'ensemble

Cette application Pokédex permet de gérer une collection de Pokémons avec les opérations CRUD complètes (Create, Read, Update, Delete). Elle utilise une architecture moderne Angular avec :
- **Signals** pour la gestion réactive de l'état
- **Standalone Components** (sans NgModule)
- **Reactive Forms** pour les formulaires de création/édition
- **HTTP Client** pour les appels API REST
- **Guards** pour la protection des routes
- **Directives personnalisées** pour les interactions UI

## ✨ Fonctionnalités

### 🔐 Authentification
- Page de connexion avec validation
- Protection des routes via AuthGuard
- Identifiants par défaut : `Pikachu / Pikachu#`

### 📝 Gestion des Pokémons
- **Liste** : Affichage de tous les Pokémons avec recherche par nom
- **Profil** : Vue détaillée d'un Pokémon (image, stats, types, date de création)
- **Création** : Ajout d'un nouveau Pokémon avec formulaire validé
- **Édition** : Modification d'un Pokémon existant
- **Suppression** : Retrait d'un Pokémon de la collection

### 🎨 Interface utilisateur
- Design responsive avec Bootstrap 5
- Cartes Pokémon interactives avec effet de bordure au survol
- Badges colorés selon les types de Pokémon
- Spinner de chargement pour les requêtes HTTP
- Page 404 personnalisée

## 🏗️ Architecture du projet

```
src/
├── app/
│   ├── core/                          # Fonctionnalités centrales
│   │   └── auth/                      # Module d'authentification
│   │       ├── auth.guard.ts          # Guard de protection des routes
│   │       └── auth.service.ts        # Service de gestion de l'authentification
│   │
│   ├── pokemon/                       # Module principal Pokémon
│   │   ├── pokemon-list/              # Liste des Pokémons
│   │   │   ├── pokemon-list.component.ts
│   │   │   └── pokemon-list.component.html
│   │   ├── pokemon-profile/           # Profil détaillé
│   │   │   ├── pokemon-profile.component.ts
│   │   │   └── pokemon-profile.component.html
│   │   ├── pokemon-add/               # Création de Pokémon
│   │   │   ├── pokemon-add.component.ts
│   │   │   └── pokemon-add.component.html
│   │   └── pokemon-edit/              # Édition de Pokémon
│   │       ├── pokemon-edit.component.ts
│   │       └── pokemon-edit.component.html
│   │
│   ├── services/                      # Services partagés
│   │   └── pokemon.service.ts         # Service HTTP pour les Pokémons
│   │
│   ├── login/                         # Composant de connexion
│   │   ├── login.component.ts
│   │   └── login.component.html
│   │
│   ├── page-no-found/                 # Page 404
│   │   ├── page-no-found.component.ts
│   │   └── page-no-found.component.html
│   │
│   ├── pokemon.model.ts               # Interface et types Pokémon
│   ├── pokemon-list.fake.ts           # Données de test
│   ├── pokeman-border.directive.ts    # Directive d'effet de bordure
│   ├── app.component.ts               # Composant racine
│   ├── app.component.html             # Template racine
│   ├── app.config.ts                  # Configuration de l'application
│   └── main.ts                        # Point d'entrée de l'application
│
├── db.json                            # Base de données JSON Server
└── package.json                       # Dépendances du projet
```

## 🛠️ Technologies utilisées

- **Angular 21.0.0** - Framework principal
- **TypeScript** - Langage de développement
- **RxJS** - Programmation réactive
- **Bootstrap 5** - Framework CSS
- **JSON Server** - API REST mock pour le développement
- **Angular Forms** - Gestion des formulaires réactifs
- **Angular Router** - Navigation et routage

## 🚀 Installation et démarrage

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd angular_pokedex-app

# Installer les dépendances
npm install
```

### Démarrage

**1. Démarrer l'API backend (JSON Server)**
```bash
npm run start:api
```
L'API sera accessible sur `http://localhost:3000`

**2. Démarrer l'application Angular**
```bash
npm run start
# ou
ng serve -o
```
L'application sera accessible sur `http://localhost:4200`

### Connexion
- **Nom d'utilisateur** : `Pikachu`
- **Mot de passe** : `Pikachu#`

## 📚 Structure du code

### Modèle de données (pokemon.model.ts)

```typescript
interface Pokemon {
  id: number;              // Identifiant unique
  name: string;            // Nom du Pokémon
  picture: string;         // URL de l'image
  life: number;            // Points de vie
  damage: number;          // Points de dégâts
  types: [string, string?, string?]; // 1 à 3 types
  created: Date;           // Date de création
}
```

### Règles de validation (POKEMON_RULES)

```typescript
MIN_NAME: 3        // Longueur minimale du nom
MAX_NAME: 20       // Longueur maximale du nom
MIN_LIFE: 10       // Points de vie minimum
MAX_LIFE: 30       // Points de vie maximum
MIN_DAMAGE: 1      // Dégâts minimum
MAX_DAMAGE: 10     // Dégâts maximum
MIN_TYPES: 1       // Minimum 1 type requis
MAX_TYPES: 3       // Maximum 3 types autorisés
```

### Routes de l'application

| Route | Composant | Protection | Description |
|-------|-----------|------------|-------------|
| `/login` | LoginComponent | ❌ | Page de connexion |
| `/pokemons` | PokemonListComponent | ✅ | Liste des Pokémons |
| `/pokemons/add` | PokemonAddComponent | ✅ | Ajout d'un Pokémon |
| `/pokemons/:id` | PokemonProfileComponent | ✅ | Profil d'un Pokémon |
| `/pokemons/edit/:id` | PokemonEditComponent | ✅ | Édition d'un Pokémon |
| `/**` | PageNoFoundComponent | ❌ | Page 404 |

## 🧩 Concepts Angular utilisés

### 1. **Signals** (Nouveauté Angular 16+)
Gestion réactive de l'état sans RxJS :
```typescript
readonly searchTerm = signal('');
readonly name = signal('');
readonly loading = computed(() => this.pokemonList().length === 0);
```

### 2. **Standalone Components** (Angular 14+)
Composants sans NgModule :
```typescript
@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pokemon-list.component.html'
})
```

### 3. **Control Flow Syntax** (Angular 17+)
Nouvelle syntaxe de template :
```html
@if (loading()) {
  <div>Chargement...</div>
}

@for (pokemon of pokemonList(); track pokemon.id) {
  <div>{{ pokemon.name }}</div>
}
```

### 4. **Reactive Forms**
Formulaires avec validation :
```typescript
readonly form = new FormGroup({
  name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  types: new FormArray([new FormControl('Normal')])
});
```

### 5. **toSignal()** (Angular 16+)
Conversion Observable → Signal :
```typescript
readonly pokemonList = toSignal(
  this.pokemonService.getPokemonList(),
  { initialValue: [] }
);
```

### 6. **Guards fonctionnels**
Protection des routes :
```typescript
export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.isLoggedIn() || router.navigate(['/login']);
};
```

### 7. **Directives personnalisées**
Interactions UI réutilisables :
```typescript
@Directive({ selector: '[appPokemanBorder]' })
export class PokemanBorder {
  @HostListener('mouseenter') onMouseEnter() { /* ... */ }
}
```

### 8. **HTTP Client avec gestion d'erreur**
```typescript
this.#http.get<Pokemon[]>(this.API_URL).pipe(
  map(data => ({ value: data, error: undefined })),
  catchError(error => of({ value: undefined, error }))
);
```

## 📖 Commandes utiles

```bash
# Démarrer en mode développement
ng serve -o

# Démarrer l'API
npm run start:api

# Générer un nouveau composant
ng generate component nom-composant --skip-tests --inline-style

# Générer un service
ng generate service services/nom-service --skip-tests

# Générer une directive
ng generate directive nom-directive --skip-tests

# Build de production
ng build --configuration production

# Linter le code
ng lint
```

## 🎓 Points d'apprentissage

Ce projet couvre les concepts suivants :
- ✅ Architecture Angular moderne (Standalone)
- ✅ Gestion d'état avec Signals
- ✅ Formulaires réactifs avec validation
- ✅ Appels HTTP et gestion d'erreurs
- ✅ Routage et navigation
- ✅ Guards d'authentification
- ✅ Directives personnalisées
- ✅ Pipes de transformation
- ✅ Binding de données (one-way, two-way, event)
- ✅ Communication parent-enfant
- ✅ Observables et conversion en Signals

## 📝 Notes importantes

- **L'authentification est simulée** : En production, utilisez un vrai système d'authentification avec JWT
- **JSON Server** : Utilisé uniquement pour le développement. En production, remplacez par une vraie API backend
- **Les images** : Proviennent du site officiel Pokémon. Assurez-vous d'avoir une connexion Internet
- **Les types de Pokémon** : Limités à 9 types pour la démonstration

## 🐛 Débogage courant

### Erreur CORS
Si vous rencontrez des erreurs CORS, vérifiez que JSON Server est bien démarré sur le port 3000.

### Port déjà utilisé
Si le port 4200 est occupé, utilisez :
```bash
ng serve --port 4201
```

### Erreurs de compilation TypeScript
Vérifiez que vous utilisez la bonne version de TypeScript compatible avec Angular 21.

## 📄 Licence

Ce projet est à usage éducatif.

---

Développé avec ❤️ et Angular
