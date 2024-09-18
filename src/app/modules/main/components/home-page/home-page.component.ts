import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AsyncPipe, NgForOf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { combineLatest, map, Observable, startWith } from "rxjs";

//relative paths
import { CountriesService } from "../../../../core/services/countries.service";
import { InputComponent } from "../../../../shared/input/input.component";
import { ICountry } from "../../../../core/interfaces/country.interface";
import { RandomCountriesWidgetComponent } from "../random-countries-widget/random-countries-widget.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    InputComponent,
    ReactiveFormsModule,
    NgForOf,
    AsyncPipe,
    RouterLink,
    RandomCountriesWidgetComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private countriesService: CountriesService = inject(CountriesService);
  public searchForm: FormGroup;
  countries$: Observable<ICountry[]>;
  searchCountries$: Observable<ICountry[]> = new Observable<ICountry[]>();

  constructor(
  ) {
    this.searchForm = this.fb.group({
      search: ['']
    });

    this.countries$ = this.countriesService.getCountries();
  }

  ngOnInit(): void {
    const searchField = this.searchForm.controls['search'].valueChanges.pipe(startWith(''));

    this.searchCountries$ = combineLatest([this.countries$, searchField])
      .pipe(
        map(([countries, search]) => {
          if (search) {
            return countries.filter(country =>
              country.name.toLowerCase().includes(search.toLowerCase())
            );
          }
          return countries;
        })
      );
  }
}
