import { Routes } from '@angular/router';

import { WishlistComponent } from './wishlist/wishlist.component';
import { HomeComponent } from './home/home.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'bookDetails', component: BookDetailsComponent },
    { path: "wishlist", component: WishlistComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
];
