# 📘 Documentation Technique - Angular Pokédex

## 📑 Table des matières

1. [Architecture globale](#architecture-globale)
2. [Gestion de l'état avec Signals](#gestion-de-létat-avec-signals)
3. [Pattern Observable et HTTP](#pattern-observable-et-http)
4. [Formulaires réactifs](#formulaires-réactifs)
5. [Système de routage](#système-de-routage)
6. [Authentification](#authentification)
7. [Bonnes pratiques](#bonnes-pratiques)

---

## 🏗️ Architecture globale

### Structure en couches

```
┌─────────────────────────────────────────┐
│         COMPOSANTS (UI Layer)           │
│  pokemon-list, pokemon-profile, etc.    │
└─────────────────┬───────────────────────┘
                  │ inject()
┌─────────────────▼───────────────────────┐
│         SERVICES (Business Layer)       │
│  PokemonService, AuthService            │
└─────────────────┬───────────────────────┘
                  │ HttpClient
┌─────────────────▼───────────────────────┐
│         API REST (Data Layer)           │
│  JSON Server (localhost:3000)           │
└─────────────────────────────────────────┘
```

### Principes appliqués

- **Separation of Concerns** : Séparation claire UI / Business / Data
- **Dependency Injection** : Services injectés via `inject()`
- **Reactive Programming** : Utilisation d'Observables et Signals
- **Immutabilité** : Modification de l'état via `.set()` et `.update()`

---

## 🔄 Gestion de l'état avec Signals

### Qu'est-ce qu'un Signal ?

Un **Signal** est une valeur réactive qui notifie automatiquement ses dépendances lors d'un changement.

```typescript
// Création d'un Signal modifiable
readonly searchTerm = signal('');

// Lecture de la valeur
console.log(this.searchTerm()); // ''

// Modification de la valeur
this.searchTerm.set('Pikachu');

// Signal calculé (computed) - Se recalcule automatiquement
readonly filteredList = computed(() => {
  return this.list().filter(item => 
    item.name.includes(this.searchTerm())
  );
});
```

### Types de Signals dans le projet

#### 1️⃣ **Signal modifiable** (`signal<T>`)

```typescript
// pokemon-list.component.ts
readonly pokemonList = signal<Pokemon[]>([]);

// Modification avec .set()
this.pokemonList.set(newPokemons);

// Modification avec .update() (basé sur la valeur précédente)
this.pokemonList.update(pokemons => 
  pokemons.filter(p => p.id !== pokemonId)
);
```

#### 2️⃣ **Signal calculé** (`computed()`)

```typescript
// Se recalcule automatiquement quand ses dépendances changent
readonly filteredList = computed(() => {
  const search = this.searchTerm();
  const list = this.pokemonList();
  return list.filter(p => p.name.includes(search));
});
```

#### 3️⃣ **Signal lié** (`linkedSignal()`)

```typescript
// Synchronisation automatique entre deux Signals
readonly typeSelected = linkedSignal({
  source: this.typeList,
  computation: (newTypeList, previous) => {
    // Logique de synchronisation
    if (!previous?.value) return null;
    return newTypeList.includes(previous.value) 
      ? previous.value 
      : null;
  }
});
```

#### 4️⃣ **Signal en lecture seule** (`asReadonly()`)

```typescript
// auth.service.ts
readonly #isLoggedIn = signal(false);
readonly isLoggedIn = this.#isLoggedIn.asReadonly();
// Exposé en lecture seule, modifiable uniquement dans le service
```

### Conversion Observable → Signal

```typescript
// Avant (avec Observable)
pokemonList$: Observable<Pokemon[]>;
ngOnInit() {
  this.pokemonList$ = this.service.getPokemonList();
}
// Template : {{ pokemonList$ | async }}

// Après (avec Signal)
pokemonList = signal<Pokemon[]>([]);
constructor() {
  this.service.getPokemonList().subscribe(pokemons => {
    this.pokemonList.set(pokemons);
  });
}
// Template : {{ pokemonList() }}
```

---

## 📡 Pattern Observable et HTTP

### Cycle de vie d'un Observable

```typescript
// 1️⃣ CRÉATION : Le service retourne un Observable
getPokemonList(): Observable<Pokemon[]> {
  return this.http.get<Pokemon[]>(this.apiUrl);
}

// 2️⃣ CONFIGURATION : Ajout d'opérateurs avec pipe()
getPokemonList(): Observable<Pokemon[]> {
  return this.http.get<Pokemon[]>(this.apiUrl).pipe(
    tap(data => console.log('Données reçues', data)),
    catchError(error => of([]))
  );
}

// 3️⃣ SOUSCRIPTION : Déclenche l'exécution
this.service.getPokemonList().subscribe(pokemons => {
  this.pokemonList.set(pokemons);
});

// ⚠️ SANS subscribe(), la requête HTTP N'EST JAMAIS ENVOYÉE !
```

### Opérateurs RxJS utilisés

| Opérateur | Usage | Exemple |
|-----------|-------|---------|
| `pipe()` | Composition d'opérateurs | `.pipe(tap(), map(), catchError())` |
| `tap()` | Effet de bord sans modification | `tap(data => console.log(data))` |
| `map()` | Transformation des données | `map(pokemons => pokemons.filter(...))` |
| `catchError()` | Gestion des erreurs | `catchError(err => of([]))` |
| `of()` | Crée un Observable simple | `of([])` |
| `delay()` | Retarde l'émission | `delay(1000)` |

### Gestion des erreurs HTTP

```typescript
// Pattern utilisé dans pokemon.service.ts
getPokemonById(id: number): Observable<Pokemon | undefined> {
  return this.http.get<Pokemon>(`${this.apiUrl}/${id}`).pipe(
    map(pokemon => ({ value: pokemon, error: undefined })),
    catchError(error => of({ value: undefined, error }))
  );
}

// Dans le composant
readonly pokemon = toSignal(
  this.service.getPokemonById(this.id).pipe(
    map(response => response.value),
    catchError(() => of(undefined))
  )
);
```

---

## 📝 Formulaires réactifs

### Structure d'un FormGroup

```typescript
readonly form = new FormGroup({
  // FormControl simple avec validateurs
  name: new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
    Validators.pattern(/^[a-zA-Z]+$/)
  ]),
  
  // FormControl avec valeur par défaut
  life: new FormControl(10),
  
  // FormArray pour valeurs multiples
  types: new FormArray(
    [new FormControl('Normal')],
    [Validators.required, Validators.maxLength(3)]
  )
});
```

### Accès aux contrôles

```typescript
// Getters pour faciliter l'accès
get pokemonName() {
  return this.form.get('name') as FormControl;
}

get pokemonTypeList() {
  return this.form.get('types') as FormArray;
}

// Utilisation
this.pokemonName.value       // Lecture
this.pokemonName.setValue(v) // Écriture
this.pokemonName.invalid     // État de validation
```

### Gestion du FormArray

```typescript
// Ajouter un élément
this.pokemonTypeList.push(new FormControl('Feu'));

// Supprimer un élément
this.pokemonTypeList.removeAt(index);

// Parcourir les contrôles
this.pokemonTypeList.controls.forEach(control => {
  console.log(control.value);
});
```

### États de validation

```typescript
// États d'un FormControl
control.valid      // ✅ Valide
control.invalid    // ❌ Invalide
control.dirty      // Modifié par l'utilisateur
control.pristine   // Non modifié
control.touched    // A reçu le focus
control.untouched  // N'a jamais reçu le focus

// Forcer l'affichage des erreurs
Object.values(this.form.controls).forEach(control => {
  control.markAsDirty();
});
```

### Template avec validation

```html
<input
  formControlName="name"
  [class.is-invalid]="pokemonName.invalid && pokemonName.dirty"
/>

<!-- Messages d'erreur conditionnels -->
@if(pokemonName.hasError('required')) {
  <div class="invalid-feedback">Champ requis</div>
}
@if(pokemonName.hasError('minlength')) {
  <div class="invalid-feedback">
    Minimum {{ pokemonName.getError('minlength').requiredLength }} caractères
  </div>
}
```

---

## 🧭 Système de routage

### Configuration des routes

```typescript
// app.config.ts
const routes: Routes = [
  // Route publique
  { path: 'login', component: LoginComponent },
  
  // Routes protégées avec Guard
  {
    path: 'pokemons',
    canActivateChild: [AuthGuard],
    children: [
      { path: '', component: PokemonListComponent },
      { path: 'add', component: PokemonAddComponent },
      { path: ':id', component: PokemonProfileComponent },
      { path: 'edit/:id', component: PokemonEditComponent }
    ]
  },
  
  // Redirection
  { path: '', redirectTo: 'pokemons', pathMatch: 'full' },
  
  // Page 404 (doit être en dernier)
  { path: '**', component: PageNoFoundComponent }
];
```

### Navigation programmatique

```typescript
// Injection du Router
readonly #router = inject(Router);

// Navigation simple
this.#router.navigate(['/pokemons']);

// Navigation avec paramètre
this.#router.navigate(['/pokemons', pokemonId]);

// Navigation avec query params
this.#router.navigate(['/pokemons'], { 
  queryParams: { search: 'pikachu' } 
});
```

### Récupération des paramètres

```typescript
// Injection de ActivatedRoute
readonly #route = inject(ActivatedRoute);

// Paramètre d'URL (ex: /pokemons/5)
const id = Number(this.#route.snapshot.paramMap.get('id'));

// Query parameter (ex: /pokemons?search=pikachu)
const search = this.#route.snapshot.queryParamMap.get('search');
```

---

## 🔐 Authentification

### Architecture du système d'auth

```
┌──────────────┐
│ AuthService  │ ← Gère l'état de connexion (Signal)
└──────┬───────┘
       │
       │ inject()
       │
┌──────▼───────┐
│  AuthGuard   │ ← Protège les routes
└──────────────┘
```

### AuthService

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signal privé (modifiable uniquement ici)
  readonly #isLoggedIn = signal(false);
  
  // Signal public en lecture seule
  readonly isLoggedIn = this.#isLoggedIn.asReadonly();
  
  login(name: string, password: string): Observable<boolean> {
    const isLoggedIn = name === "Pikachu" && password === "Pikachu#";
    this.#isLoggedIn.set(isLoggedIn);
    return of(isLoggedIn).pipe(delay(1000));
  }
}
```

### AuthGuard

```typescript
export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  
  return true;
};
```

---

## ✅ Bonnes pratiques

### 1️⃣ **Nommage des Signals et Observables**

```typescript
// ✅ BON : Signal sans suffixe
readonly pokemonList = signal<Pokemon[]>([]);
readonly loading = computed(() => ...);

// ✅ BON : Observable avec suffixe $
readonly pokemonList$ = this.service.getPokemonList();

// ❌ MAUVAIS : Mélange des conventions
readonly pokemonList$ = signal<Pokemon[]>([]);
```

### 2️⃣ **Utilisation de readonly**

```typescript
// ✅ BON : Protège contre les réassignations
readonly pokemonList = signal<Pokemon[]>([]);

// ❌ MAUVAIS : Peut être réassigné par erreur
pokemonList = signal<Pokemon[]>([]);
```

### 3️⃣ **Membres privés avec #**

```typescript
// ✅ BON : Service privé (convention TypeScript moderne)
readonly #pokemonService = inject(PokemonService);

// ✅ ACCEPTABLE : Service privé (convention classique)
private readonly pokemonService = inject(PokemonService);
```

### 4️⃣ **Gestion des souscriptions**

```typescript
// ✅ BON : Souscription dans le constructor (auto-cleanup)
constructor() {
  this.service.getData().subscribe(data => {
    this.data.set(data);
  });
}

// ✅ BON : Utilisation de toSignal (auto-cleanup)
readonly data = toSignal(this.service.getData());

// ⚠️ ATTENTION : Unsubscribe manuel nécessaire si souscription dans ngOnInit
```

### 5️⃣ **Validation des formulaires**

```typescript
// ✅ BON : Validation avant soumission
onSubmit() {
  Object.values(this.form.controls).forEach(c => c.markAsDirty());
  
  if (this.form.invalid) {
    return;
  }
  
  // Traitement...
}
```

### 6️⃣ **Typage strict**

```typescript
// ✅ BON : Type explicite
readonly pokemonList = signal<Pokemon[]>([]);

// ✅ BON : Omit pour exclure des propriétés
addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon>

// ❌ MAUVAIS : Type any
readonly pokemonList = signal<any>([]);
```

---

## 🎓 Ressources complémentaires

- **Documentation Angular** : https://angular.dev
- **RxJS** : https://rxjs.dev
- **Angular Signals** : https://angular.dev/guide/signals
- **Reactive Forms** : https://angular.dev/guide/forms/reactive-forms

---

**Dernière mise à jour** : 14 décembre 2025
