import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment.development';
import { urlToBlobImageUrl } from '../utils/download-media';
import { BlogObject } from './blog-service';
import { json } from 'stream/consumers';

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

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private router: Router) { }

    async getBloger(username: string | null): Promise<{ success: boolean; data: { profile: UserObject, blogs: BlogObject[] } }> {
        try {
            const url = (username == null) ? `` : `/${username}`
            const res = await fetch(`${environment.apiURL}/api/users${url}`, (username == null) ? {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                },
            } : {});

            if (res.ok) {
                const data: { profile: UserObject, blogs: BlogObject[] } = await res.json();
                data.profile.picture = await urlToBlobImageUrl(data.profile.picture);

                for (let i = 0; i < data.blogs.length; i++) {
                    data.blogs[i].cover = await urlToBlobImageUrl(data.blogs[i].cover);
                }

                return { success: true, data: data };
            } else {
                return { success: false, data: { profile: createEmptyUserObject(), blogs: [] } };
            }
        } catch (error) {
            console.error("Error getting bloger: ", error);
            return { success: false, data: { profile: createEmptyUserObject(), blogs: [] } };
        }
    }

    async makeFollow(username: string): Promise<{ success: boolean; data: { follows: number, status: number } }> {
        try {
            const res = await fetch(`${environment.apiURL}/api/follows/${username}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                },
            });

            if (res.ok) {
                const data: { follows: number, status: number } = await res.json();
                return { success: true, data: data };
            } else {
                return { success: false, data: { follows: 0, status: 0 } };
            }
        } catch (error) {
            console.error("Error getting bloger: ", error);
            return { success: false, data: { follows: 0, status: 0 } };
        }
    }

    async makeLike(blogId: number): Promise<{ success: boolean; data: { likes: number, status: number } }> {
        try {
            const res = await fetch(`${environment.apiURL}/api/likes/${blogId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                },
            });

            if (res.ok) {
                const data: { likes: number, status: number } = await res.json();
                return { success: true, data: data };
            } else {
                return { success: false, data: { likes: 0, status: 0 } };
            }
        } catch (error) {
            console.error("Error getting bloger: ", error);
            return { success: false, data: { likes: 0, status: 0 } };
        }
    }

    async makeComment(blogId: number, comment: string): Promise<{ success: boolean, comment: CommentObject }> {
        try {
            const res = await fetch(`${environment.apiURL}/api/comments/${blogId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                },
                method: 'POST',
                body: comment
            });

            if (res.ok) {
                const comment: CommentObject = await res.json();
                return { success: true, comment: comment };
            } else {
                return { success: false, comment: createEmptyCommentObject() };
            }
        } catch (error) {
            console.error("Error getting bloger: ", error);
            return { success: false, comment: createEmptyCommentObject() };
        }
    }
}
