import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { MediaService } from './media-service';
import { BlogObject } from './blog-service';
import { catchError, forkJoin, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface UserObject {
  username: string,
  email: string,
  bio: string,
  role: string,
  createdAt: string,
  isFollowing: boolean,
  followers: number
}


export interface CommentObject {
  id: number,
  author: string,
  blog: number,
  content: string,
  createdAt: string
}

export interface NotificationObject {
  id: number,
  user_id: number,
  content: string,
  createdAt: string,
}

export function createEmptyNotificationObject() {
  return {
    id: 0,
    user_id: 0,
    content: "",
    createdAt: ""
  }
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient, private mediaService: MediaService) { }

  getBloger(username: string | null): Observable<{ profile: UserObject, blogs: BlogObject[] } | null> {
    const url = username ? `/${username}` : '';

    return this.http.get<{ profile: UserObject, blogs: BlogObject[] }>(
      `${environment.apiURL}/api/users${url}`,
      { headers: new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}` }) }
    ).pipe(
      switchMap(data => {
        const profile$ = of(data.profile);

        const blogs$ = data.blogs.length > 0 ? forkJoin(
          data.blogs.map(blog =>
            this.mediaService.urlToBlobImageUrl(blog.cover).pipe(
              map(newImage => {
                blog.cover = newImage;
                return blog;
              })
            )
          )
        ) : of([]);

        return forkJoin({ profile: profile$, blogs: blogs$ });
      }),
      catchError(error => {
        console.error("Error getting bloger: ", error);
        return of(null);
      })
    );

  }

  makeFollow(username: string): Observable<{ follows: number, status: number } | null> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
    });
    return this.http.post<{ follows: number, status: number }>(
      `${environment.apiURL}/api/follows/${username}`,
      null,
      { headers }
    ).pipe(
      catchError((err) => of(null))
    );
  }

  makeLike(blogId: number): Observable<{ likes: number, status: number } | any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
    });
    return this.http.post<{ likes: number, status: number }>(
      `${environment.apiURL}/api/likes/${blogId}`,
      null,
      { headers }
    ).pipe(
      catchError((err) => of(null))
    );
  }

  makeComment(blogId: number, comment: string): Observable<CommentObject | null> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
    });
    return this.http.post<CommentObject>(
      `${environment.apiURL}/api/comments/${blogId}`,
      comment,
      { headers }
    );
  }

  getNotifications(): Observable<NotificationObject[] | null> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
    });

    return this.http.get<NotificationObject[]>(
      `${environment.apiURL}/api/notifications`, { headers }
    ).pipe(
      map(notif => notif.map(not => {
        return {
          ...not,
          createAt: new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(not.createdAt))
        }
      })),
      catchError((err: any) => {
        return of(null);
      })
    );
  }

  deletetNotifications(id: number): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
    });

    return this.http.delete(
      `${environment.apiURL}/api/notifications/${id}`,
      { headers }
    ).pipe(
      map((res) => true),
      catchError((err) => of(false))
    );
  }

  makeReport(reported: string, reasons: string[], details: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
    });

    const content = (reasons.join(', ') + ' ' + details).trim()

    return this.http.post(`${environment.apiURL}/api/reports`, {
      reported: reported,
      content: content,
    }, { headers })
      .pipe(
        map((res) => true),
        catchError(((err) => of(false)))
      )
  }
}
