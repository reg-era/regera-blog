import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) { }

  getReports(): Observable<string | null> {
    return of('ok');
  }

  escalateAdmin(username: string): Observable<string | null> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
    });

    return this.http.put(
      `${environment.apiURL}/api/admin/users/${username}`, undefined, { headers }
    ).pipe(
      map((res: any) => res.message),
      catchError((err: any) => {
        return of(null);
      })
    );
  }

  removeUser(username: string): Observable<number | null> {
    return of(200);
  }

  removeBlog(blogid: number): Observable<number | null> {
    return of(200);
  }
}
