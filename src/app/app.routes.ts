import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { OauthSuccessComponent } from './pages/oauth-success/oauth-success.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
  ,{
  path: 'oauth-success',
  component: OauthSuccessComponent
}


];
