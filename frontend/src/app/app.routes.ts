import { Routes } from '@angular/router';

import { WishlistComponent } from './wishlist/wishlist.component';
import { HomeComponent } from './home/home.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AdminComponent } from './admin/admin.component';
import { InsertBookComponent } from './insert-book/insert-book.component';
import { ViewBooksComponent } from './view-books/view-books.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'bookDetails', component: BookDetailsComponent },
    { path: "wishlist", component: WishlistComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            { path: '', component: InsertBookComponent },
            { path: 'view-books', component: ViewBooksComponent },
            { path: 'view-orders', component: ViewOrdersComponent }
        ]
    },
    { path: '', redirectTo: 'admin', pathMatch: 'full' }
];
