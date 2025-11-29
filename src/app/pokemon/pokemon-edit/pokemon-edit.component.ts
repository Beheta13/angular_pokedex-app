import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Pokemonservice } from '../../services/pokemon.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-edit',
  standalone: true,
  imports: [ RouterLink, ReactiveFormsModule],
  templateUrl: './pokemon-edit.component.html',
  styles: ``,
})
export class PokemonEditComponent {
  readonly route = inject(ActivatedRoute);
  readonly pokemonService = inject(Pokemonservice);
  readonly pokemonId = signal(Number(this.route.snapshot.paramMap.get('id')));
  readonly pokemon = signal(
    this.pokemonService.getPokemonById(this.pokemonId())
  ).asReadonly();

  readonly form = new FormGroup({
    name: new FormControl(this.pokemon().name),
    life: new FormControl(this.pokemon().life),
    damage: new FormControl(this.pokemon().damage),
    type: new FormArray(
      this.pokemon().types.map((type) => new FormControl(type))
    ),
  });

  get pokemonTypeList(): FormArray {
    return this.form.get('type') as FormArray;
  }

  isPokemeonTypeSelected(type: string): boolean {
    return !!this.pokemonTypeList.controls.find(
      (control) => control.value === type
    );
  }

  onPokemonTypeChange(type: string, isChecked: boolean) {
    if (isChecked) {
      const control = new FormControl(type);
      this.pokemonTypeList.push(control);
    } else {
      const index = this.pokemonTypeList.controls
        .map((control) => control.value)
        .indexOf(type);

      this.pokemonTypeList.removeAt(index);
    }
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
