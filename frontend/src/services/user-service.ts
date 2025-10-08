import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { MediaService } from './media-service';
import { BlogObject } from './blog-service';
import { catchError, forkJoin, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface UserObject {
  username: string,
  picture: string,
  email: string,
  bio: string,
  role: string,
  createdAt: string,
  isFollowing: boolean,
  followers: number
}

export function createEmptyUserObject(): UserObject {
  return {
    username: '',
    picture: '',
    email: '',
    bio: '',
    role: '',
    createdAt: '',
    isFollowing: false,
    followers: 0,
  };
}

export interface CommentObject {
  id: number,
  author: string,
  blog: number,
  content: string,
  createdAt: string
}

export function createEmptyCommentObject() {
  return {
    id: 0,
    author: '',
    blog: 0,
    content: '',
    createdAt: ''
  }
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
        const profile$ = this.mediaService.urlToBlobImageUrl(data.profile.picture).pipe(
          map(newImage => {
            data.profile.picture = newImage;
            return data.profile;
          })
        );

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

  async getNotifications(): Promise<{ success: boolean, notification: NotificationObject[] }> {
    try {
      const res = await fetch(`${environment.apiURL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
      });

      if (res.ok) {
        const notif: NotificationObject[] = await res.json();
        return { success: true, notification: notif };
      } else {
        return { success: false, notification: [createEmptyNotificationObject()] };
      }
    } catch (error) {
      console.error("Error getting bloger: ", error);
      return { success: false, notification: [createEmptyNotificationObject()] };
    }
  }

  async deletetNotifications(id: number): Promise<boolean> {
    try {
      const res = await fetch(`${environment.apiURL}/api/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        method: 'DELETE'
      });

      if (res.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error getting bloger: ", error);
      return false;
    }
  }

  makeReport(reported: string, reasons: string[], details: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
    });

    const content = (reasons.join(', ') + '<br>' + details).trim()

    return this.http.post(`${environment.apiURL}/api/reports`, {
      reported: reported,
      content: content,
    }, { headers })
      .pipe(
        map((data) => {
          console.log(data);
          return true;
        }),
        catchError(((err) => {
          console.error('Error: ', err);
          return of(false);
        }))
      )
  }
}
