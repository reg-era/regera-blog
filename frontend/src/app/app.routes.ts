import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Bloger } from './bloger/bloger';
import { Blog } from './blog/blog';
import { Newblog } from './newblog/newblog';
import { Dashboard } from './dashboard/dashboard';
import { Notifications } from './notification/notification';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'blogger/:username', component: Bloger },
    { path: 'profile', component: Bloger },
    { path: 'blog/:id', component: Blog },
    { path: 'newblog', component: Newblog },
    { path: 'notification', component: Notifications },
    { path: 'dashboard', component: Dashboard },
    { path: '**', component: Home },
];
