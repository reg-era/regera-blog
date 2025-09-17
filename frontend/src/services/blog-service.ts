import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';


export interface BlogFormModel {
    title: string | any,
    description: string | any,
    content: string | any,
    media: string | any,
}

@Injectable({ providedIn: 'root' })
export class BlogService {
    constructor(private authService: AuthService, private router: Router) { }

    async sendBlog(blog: BlogFormModel, method: string = 'POST'): Promise<{ success: boolean; message?: string }> {
        try {
            const formData = new FormData();

            formData.append('title', blog.title);
            formData.append('content', blog.content);
            formData.append('description', blog.content);

            if (blog.media) {
                formData.append('media', blog.media);
            }

            const res = await fetch('http://127.0.0.1:8080/api/blogs', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                },
                method: method,
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
}