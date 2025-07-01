import { Routes } from '@angular/router';

import { WishlistComponent } from './wishlist/wishlist.component';
import { HomeComponent } from './home/home.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import {OrderHistoryComponent} from './order-history/order-history.component'
import {UserProfileComponent} from './user-profile/user-profile.component'
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { OAuthSuccessComponent } from './oauth-success/oauth-success.component';
// import { AdminComponent } from './admin/admin.component';
// import { InsertBookComponent } from './insert-book/insert-book.component';
// import { ViewBooksComponent } from './view-books/view-books.component';
// import { ViewOrdersComponent } from './view-orders/view-orders.component';

export const routes: Routes = [

    {path:"",redirectTo: 'home', pathMatch: 'full' },
    {path:"home",component:HomeComponent},
    { path: 'bookDetails', component: BookDetailsComponent },
    { path: "wishlist", component: WishlistComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    {path:'order', component:OrderHistoryComponent},
    {path:'profile', component:UserProfileComponent},
    {path:'login' , component:LoginComponent},
    {path:'register' , component:RegisterComponent},
{
  path: 'reset-password/:token',
  loadComponent: () =>
    import('../app/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
},
 { path: 'oauth-success', component: OAuthSuccessComponent },
{ path: 'notfound', component: NotFoundPageComponent },
  { path: '**', redirectTo: 'notfound' }

    // {
    //     path: 'admin',
    //     component: AdminComponent,
    //     children: [
    //         { path: '', component: InsertBookComponent },
    //         { path: 'view-books', component: ViewBooksComponent },
    //         { path: 'view-orders', component: ViewOrdersComponent }
    //     ]
    // },
    // { path: '', redirectTo: 'admin', pathMatch: 'full' }
];
