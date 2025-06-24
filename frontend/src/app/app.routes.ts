import { Routes } from '@angular/router';
import { WishlistComponent } from '../app/pages/wishlist/wishlist.component';
import { HomeComponent } from '../app/pages/home/home.component';
import { BookDetailsComponent } from '../app/pages/book-details/book-details.component';
import { LoginComponent } from './pages/pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  {path:'' , redirectTo:'login' , pathMatch:'full'},
    { path: 'home', component: HomeComponent },
    { path: 'bookDetails', component: BookDetailsComponent },
    { path: "wishlist", component: WishlistComponent },
    {path:'login' , component:LoginComponent},
    {path:'register' , component:RegisterComponent},

];
