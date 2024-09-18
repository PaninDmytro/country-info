import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from "@angular/common";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";

// relative paths
import { CountriesService } from "../../../../core/services/countries.service";
import { IPublicHoliday } from "../../../../core/interfaces/public-holidays.interface";
import { years } from "../../../../core/constants/year.constant";

@Component({
  selector: 'app-country-page',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    DatePipe,
    NgForOf
  ],
  templateUrl: './country-page.component.html',
  styleUrl: './country-page.component.scss'
})
export class CountryPageComponent implements OnInit {
  countriesService: CountriesService = inject(CountriesService);
  route: ActivatedRoute = inject(ActivatedRoute);
  holidays$: Observable<IPublicHoliday[]> = new Observable<IPublicHoliday[]>;
  selectedYear: number = new Date().getFullYear();
  years: number[] = years;

  ngOnInit(): void {
    this.getHolidays();
  }

  getHolidays(year?: string): void {
    this.route.params.subscribe(params => {
      const countryCode = params['code'];
      let selectedYear = this.selectedYear.toString();

      if (!countryCode) return;
      if (year) selectedYear = year;

      this.holidays$ = this.countriesService.getHolidays(countryCode, selectedYear);
    });
  }

  onYearChange(year: number): void {
    this.getHolidays(year.toString());
  }

  trackByYear(index: number, year: number): number {
    return year;
  }
}
