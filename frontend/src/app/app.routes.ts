import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Bloger } from './bloger/bloger';
import { Blog } from './blog/blog';
import { Newblog } from './newblog/newblog';
import { Notfound } from './notfound/notfound';
import { Dashboard } from './dashboard/dashboard';
import { AuthGuard } from '../services/auth-service';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'bloger/:id', component: Bloger },
    { path: 'profile', component: Bloger, canActivate: [AuthGuard] },
    { path: 'blog/:id', component: Blog },
    { path: 'newblog', component: Newblog, canActivate: [AuthGuard] },
    { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
    { path: '**', component: Notfound },
];
