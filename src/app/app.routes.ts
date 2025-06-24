import { Routes } from '@angular/router';
import { CartComponent } from '../../frontend/src/app/cart/cart.component';
import { BookDetailsComponent } from '../../frontend/src/app/book-details/book-details.component';
import { CheckoutComponent } from '../../frontend/src/app/checkout/checkout.component';
export const routes: Routes = [
{path : 'cart', component: CartComponent},
{path : 'checkout', component: CheckoutComponent},
{path : 'book-details', component: BookDetailsComponent}
];
