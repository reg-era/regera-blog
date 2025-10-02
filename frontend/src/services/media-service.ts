import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private cache = new Map<string, Observable<string>>();

  constructor(private http: HttpClient) { }

  urlToBlobImageUrl(imageUrl: string): Observable<string> {
    if (this.cache.has(imageUrl)) {
      return this.cache.get(imageUrl)!;
    }

    const blob$ = this.http.get(`${environment.apiURL}${imageUrl}`, { responseType: 'blob' }).pipe(
      map(blob => URL.createObjectURL(blob)),
      catchError(() => of('/error-media.gif')),
      shareReplay(1)
    );

    this.cache.set(imageUrl, blob$);

    return blob$;
  }
}
