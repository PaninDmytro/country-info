import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, EMPTY, Observable } from "rxjs";

// relative paths
import { ICountry } from "../interfaces/country.interface";
import { IPublicHoliday } from "../interfaces/public-holidays.interface";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  http: HttpClient = inject(HttpClient);
  private apiUrl = environment.BASE_URL;
  constructor() { }

  getCountries(): Observable<ICountry[]> {
    return this.http.get<ICountry[]>(`${this.apiUrl}/AvailableCountries`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getNextHolidaysForCountry(countryCode: string): Observable<IPublicHoliday[]> {
    return this.http.get<IPublicHoliday[]>(`${this.apiUrl}/NextPublicHolidays/${countryCode}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getHolidays(countryCode: string, year: string): Observable<IPublicHoliday[]> {
    return this.http.get<IPublicHoliday[]>(`${this.apiUrl}/PublicHolidays/${year}/${countryCode}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(err: any): Observable<never> {
    console.error('Error occurred:', err);
    return EMPTY;
  }
}
