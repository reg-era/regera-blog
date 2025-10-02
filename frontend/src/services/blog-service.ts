import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  isVideo: boolean;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(private router: Router, private http: HttpClient, private mediaService: MediaService) { }

  async sendBlog(blog: BlogFormModel): Promise<{ success: boolean; message?: string }> {
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
        const data = await res.json();
        this.router.navigate([`/blog/${data.id}`]);
        return { success: true };
      } else {
        const { error } = await res.json();
        return { success: false, message: error };
      }
    } catch (error) {
      console.error("Error sending blog: ", error);
      return { success: false, message: 'Sorry something is wrong' };
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

  async getBlog(id: number): Promise<BlogObject | null> {
    try {
      const res = await fetch(`${environment.apiURL}/api/blogs/${id}`);

      if (res.ok) {
        const blog: BlogObject = await res.json();
        blog.isVideo = false;

        if (blog.media.endsWith('mp4')) {
          blog.isVideo = true
        };

        this.mediaService.urlToBlobImageUrl(blog.cover).subscribe((newImage) => {
          blog.cover = newImage;
        });
        this.mediaService.urlToBlobImageUrl(blog.media).subscribe(newImage => {
          blog.media = newImage;
        });

        if (blog.cover == '/error-media.gif' || blog.media == '/error-media.gif') blog.isVideo = false;
        return blog;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error sending blog: ", error);
      return null;
    }
  }

  async getComments(blogId: number, offset: number): Promise<{ success: boolean, comment: CommentObject[] }> {
    try {
      const res = await fetch(`${environment.apiURL}/api/comments/${blogId}?offset=${offset}`);
      if (res.ok) {
        const comment: CommentObject[] = await res.json();
        return { success: true, comment: comment };
      } else {
        return { success: false, comment: [] };
      }
    } catch (error) {
      console.error("Error getting bloger: ", error);
      return { success: false, comment: [] };
    }
  }

}
