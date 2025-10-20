import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MediaService } from './media-service';
import { CommentObject } from './user-service';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';


export interface BlogFormModel {
  title: string | any,
  description: string | any,
  content: string | any,
  media: string | any,
}

export interface BlogObject {
  id: number;
  title: string;
  content: string;
  description: string;
  authorName: string;
  cover: string;
  media: string;
  likes: number;
  comments: number;
  isLiking: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(
    private http: HttpClient,
    private mediaService: MediaService,
  ) { }

  sendBlog(blog: BlogFormModel): Observable<string | null> {
    const formData = new FormData();

    formData.append('title', blog.title);
    formData.append('description', blog.description);
    formData.append('content', blog.content);

    if (blog.media) {
      formData.append('media', blog.media);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
    });

    return this.http.post(
      `${environment.apiURL}/api/blogs`,
      formData,
      { headers }
    ).pipe(
      map((res) => null),
      catchError((err) => {
        console.log("from error: ", err);

        return of(err.error.error)
      })
    )
  }

  updateBlog(id: number, blog: BlogFormModel, mediaChanged: boolean): Observable<string | null> {
    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('description', blog.description);
    formData.append('content', blog.content);

    if (mediaChanged && blog.media) {
      formData.append('media', blog.media);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
    });

    return this.http.put(
      `${environment.apiURL}/api/blogs/${id}`,
      formData,
      { headers }
    ).pipe(
      map((res) => null),
      catchError((err) => of(err.error.error))
    );
  }

  deletBlog(id: number): Observable<string | null> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
    });

    return this.http.delete(
      `${environment.apiURL}/api/blogs/${id}`,
      { headers }
    ).pipe(
      map((res) => null),
      catchError((err) => of(err.error.error))
    );
  }

  getHomeBlogs(): Observable<BlogObject[] | null> {
    return this.http.get<BlogObject[]>(
      `${environment.apiURL}/api/blogs`
    ).pipe(
      switchMap(blogs => {
        if (!blogs || blogs.length === 0) return of(blogs);

        const blogsWithCovers$ = blogs.map(blog =>
          this.mediaService.urlToBlobImageUrl(blog.cover).pipe(
            map(blobUrl => ({ ...blog, cover: blobUrl }))
          )
        );

        return forkJoin(blogsWithCovers$);
      }),
      catchError((err) => {
        console.error("Error getting blogs: ", err);
        return of(null);
      })
    )
  }

  canEditBlog(id: number): Observable<boolean> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
    });

    return this.http.get<boolean>(
      `${environment.apiURL}/api/blogs/ping/${id}`, { headers }
    ).pipe(
      catchError(() => of(false))
    );
  }

  getBlog(id: number): Observable<BlogObject | null> {
    return this.http.get<BlogObject>(
      `${environment.apiURL}/api/blogs/${id}`
    ).pipe(
      catchError(err => of(null))
    );
  }

  getComments(blogId: number, offset: number): Observable<CommentObject[] | null> {
    return this.http.get<CommentObject[]>(
      `${environment.apiURL}/api/comments/${blogId}?offset=${offset}`
    );
  }
}
