import { Routes } from '@angular/router';
import { WishlistComponent } from './wishlist/wishlist.component';
import { HomeComponent } from './home/home.component';
import { BookDetailsComponent } from './book-details/book-details.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'bookDetails', component: BookDetailsComponent },
    { path: "wishlist", component: WishlistComponent }
];
