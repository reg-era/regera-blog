import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment.development';
import { urlToBlobImageUrl } from '../utils/download-media';
import { BlogObject } from './blog-service';

export interface UserObject {
    username: string,
    picture: string,
    email: string,
    bio: string,
    role: string,
    createdAt: string,
    isFollowing: boolean
}

export function createEmptyUserObject(): UserObject {
    return {
        username: '',
        picture: '',
        email: '',
        bio: '',
        role: '',
        createdAt: '',
        isFollowing: false
    };
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

}
