import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Bloger } from './bloger/bloger';
import { Blog } from './blog/blog';
import { Newblog } from './newblog/newblog';
import { Notfound } from './notfound/notfound';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    // { path: 'admin/:id', component: undefined },
    { path: 'bloger/:id', component: Bloger },
    { path: 'blog/:id', component: Blog },
    { path: 'newblog', component: Newblog },
    { path: '**', component: Notfound },
];
