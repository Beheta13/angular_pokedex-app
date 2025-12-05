import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

/**
 * Suite de tests unitaires pour le composant racine AppComponent
 *
 * Ces tests vérifient le bon fonctionnement du composant principal de l'application.
 * Utilise Jasmine pour la structure des tests et Angular TestBed pour créer
 * un environnement de test isolé.
 */
describe('App', () => {
  /**
   * Configuration exécutée avant chaque test
   *
   * Configure le module de test en important le composant standalone AppComponent
   * et compile tous les composants nécessaires.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  /**
   * Test vérifiant que le composant AppComponent peut être créé sans erreur
   */
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /**
   * Test vérifiant que le titre de l'application est correctement affiché
   *
   * Attend que le composant soit stable (toutes les tâches asynchrones terminées)
   * puis vérifie que le contenu du h1 contient le nom de l'application.
   */
  it('should render title', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, angular_pokedex-app');
  });
});
