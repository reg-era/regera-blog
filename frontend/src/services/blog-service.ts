import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
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
  constructor(private http: HttpClient, private mediaService: MediaService) { }

  async sendBlog(blog: BlogFormModel): Promise<string | null> {
    try {
      const formData = new FormData();

      formData.append('title', blog.title);
      formData.append('description', blog.description);
      formData.append('content', blog.content);

      if (blog.media) {
        formData.append('media', blog.media);
      }

      const res = await fetch(`${environment.apiURL}/api/blogs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        return null;
      } else {
        const { error } = await res.json();
        return error;
      }
    } catch (error) {
      console.error("Error sending blog: ", error);
      return 'Sorry something is wrong';
    }
  }

  async updateBlog(id: number, blog: BlogFormModel): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('title', blog.title);
      formData.append('description', blog.description);
      formData.append('content', blog.content);

      const res = await fetch(`${environment.apiURL}/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        return null;
      } else {
        const { error } = await res.json();
        return error;
      }
    } catch (error) {
      console.error("Error Updating blog: ", error);
      return 'Sorry something is wrong';
    }
  }

  async deletBlog(id: number): Promise<string | null> {
    try {
      const res = await fetch(`${environment.apiURL}/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        method: 'DELETE',
      });

      if (res.ok) {
        return null;
      } else {
        const { error } = await res.json();
        return error;
      }
    } catch (error) {
      console.error("Error Deleting blog: ", error);
      return 'Sorry something is wrong';
    }
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

  getBlog(id: number): Observable<BlogObject | null> {
    return this.http.get<BlogObject>(
      `${environment.apiURL}/api/blogs/${id}`
    );
  }

  getComments(blogId: number, offset: number): Observable<CommentObject[] | null> {
    return this.http.get<CommentObject[]>(
      `${environment.apiURL}/api/comments/${blogId}?offset=${offset}`
    );
  }

}
