import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Pokemonservice } from '../../pokemon.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pokemon-profile',
  imports: [RouterLink, DatePipe],
  templateUrl: './pokemon-profile.component.html',
  styles: ``,
})
export class PokemonProfileComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #pokemonService = inject(Pokemonservice);

  readonly #pokemonId = Number(this.#route.snapshot.paramMap.get('id'));
  readonly pokemon = signal(
    this.#pokemonService.getPokemonById(this.#pokemonId)
  );
}
