import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { urlToBlobImageUrl } from '../utils/download-media';


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

export const createEmptyBlogObject = () => {
    return {
        id: 0,
        title: '',
        content: '',
        description: '',
        authorName: '',
        cover: '',
        media: '',
        likes: 0,
        comments: 0,
        isLiking: false,
        createdAt: '',
        isVideo: false
    }
};

@Injectable({ providedIn: 'root' })
export class BlogService {
    constructor(private router: Router) { }

    async sendBlog(blog: BlogFormModel): Promise<{ success: boolean; message?: string }> {
        try {
            const formData = new FormData();

            formData.append('title', blog.title);
            formData.append('content', blog.content);
            formData.append('description', blog.content);

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

    async getHomeBlogs(): Promise<{ success: boolean; data: BlogObject[] }> {
        try {
            const res = await fetch(`${environment.apiURL}/api/blogs`);

            if (res.ok) {
                const data: BlogObject[] = await res.json();
                for (let blog of data) {
                    blog.cover = await urlToBlobImageUrl(blog.cover);
                }
                return { success: true, data: data };
            } else {
                return { success: false, data: [] };
            }
        } catch (error) {
            console.error("Error sending blog: ", error);
            return { success: false, data: [] };
        }
    }

    async getBlog(id: number): Promise<{ success: boolean; data: BlogObject }> {
        try {
            const res = await fetch(`${environment.apiURL}/api/blogs/${id}`);

            if (res.ok) {
                const blog: BlogObject = await res.json();
                blog.isVideo = false;

                if (blog.media.endsWith('mp4')) {
                    blog.isVideo = true
                };

                blog.cover = await urlToBlobImageUrl(blog.cover);
                blog.media = await urlToBlobImageUrl(blog.media);

                if (blog.cover == '/error-media.gif' || blog.media == '/error-media.gif') blog.isVideo = false;
                return { success: true, data: blog };
            } else {
                return { success: false, data: createEmptyBlogObject() };
            }
        } catch (error) {
            console.error("Error sending blog: ", error);
            return { success: false, data: createEmptyBlogObject() };
        }
    }

}
