import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { BlogerComponent } from './bloger/bloger';
import { BlogComponent } from './blog/blog';
import { NewblogComponent } from './newblog/newblog';
import { DashboardComponent } from './dashboard/dashboard';
import { NotificationsComponent } from './notification/notification';
import { ErrorComponent } from './error/error';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'blogger/:username', component: BlogerComponent },
  { path: 'profile', component: BlogerComponent },
  { path: 'blog/:id', component: BlogComponent },
  { path: 'newblog', component: NewblogComponent },
  { path: 'newblog/:id', component: NewblogComponent },
  { path: 'notification', component: NotificationsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'error/:status', component: ErrorComponent },
  { path: '**', component: ErrorComponent }
];
