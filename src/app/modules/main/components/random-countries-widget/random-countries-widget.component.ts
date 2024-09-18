import { Component, inject, OnInit } from '@angular/core';
import { Observable, forkJoin, map } from "rxjs";
import { AsyncPipe, NgForOf } from "@angular/common";

// relative paths
import { CountriesService } from "../../../../core/services/countries.service";
import { IPublicHoliday } from "../../../../core/interfaces/public-holidays.interface";
import { countryCodes } from "../../../../core/constants/country-codes.constant";

@Component({
  selector: 'app-random-countries-widget',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './random-countries-widget.component.html',
  styleUrls: ['./random-countries-widget.component.scss']
})
export class RandomCountriesWidgetComponent implements OnInit {
  countriesService: CountriesService = inject(CountriesService);
  countryCodes: string[] = countryCodes;
  countryHolidays$: Observable<{ country: string, holiday: IPublicHoliday }[]> = new Observable();

  constructor() { }

  ngOnInit(): void {
    const randomCountries = this.getRandomCountries(3);
    const holidayRequests = randomCountries.map(code =>
      this.countriesService.getNextHolidaysForCountry(code).pipe(
        map(holidays => ({ country: code, holiday: holidays[0] }))
      )
    );

    this.countryHolidays$ = forkJoin(holidayRequests);
  }

  private getRandomCountries(count: number): string[] {
    const shuffled = this.countryCodes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
