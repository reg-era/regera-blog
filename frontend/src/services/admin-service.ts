import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';


export interface ReportObject {
  reportId: number,
  reporter: string,
  reported: string,
  content: string,
  createAt: string,
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) { }

  getReports(): Observable<ReportObject[] | null> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
    });

    return this.http.get<ReportObject[]>(
      `${environment.apiURL}/api/admin/reports`, { headers }
    ).pipe(
      map(reports => reports.map(report => {
        return {
          ...report,
          createAt: new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(report.createAt))
        }
      })),
      catchError((err: any) => {
        return of(null);
      })
    );
  }

  removeReport(id: number): Observable<string | null> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
    });

    return this.http.delete(
      `${environment.apiURL}/api/admin/reports/${id}`, { headers }
    ).pipe(
      map((res: any) => res.message),
      catchError((err: any) => {
        return of(null);
      })
    );
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

  removeUser(username: string): Observable<string | null> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
    });

    return this.http.delete(
      `${environment.apiURL}/api/admin/users/${username}`, { headers }
    ).pipe(
      map((res: any) => res.message),
      catchError((err: any) => {
        return of(null);
      })
    );
  }

  removeBlog(blogid: number): Observable<string | null> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
    });

    return this.http.delete(
      `${environment.apiURL}/api/admin/blog/${blogid}`, { headers }
    ).pipe(
      map((res: any) => res.message),
      catchError((err: any) => {
        return of(null);
      })
    );
  }
}
