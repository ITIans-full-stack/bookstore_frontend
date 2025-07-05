import { Routes } from '@angular/router';

import { AuthGuard } from './shared/guards/auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { NonAdminGuard } from './shared/guards/non-admin.guard';

import { PaymentResultComponent } from './payment-result/payment-result.component';


export const routes: Routes = [
  {
  path: 'payment-result',
  component: PaymentResultComponent
},

  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'landing',
    loadComponent: () =>
      import('./landing/landing.component').then((m) => m.LandingComponent),
     canActivate: [NonAdminGuard],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
     canActivate: [NonAdminGuard],
  },{
   path: 'books',
    loadComponent: () =>
      import('./books-page/books-page.component').then((m) => m.BooksPageComponent),
     canActivate: [NonAdminGuard],
  },
  {
    path: 'books/:id',
    loadComponent: () =>
      import('./book-details/book-details.component').then((m) => m.BookDetailsComponent),
     canActivate: [NonAdminGuard],
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./wishlist/wishlist.component').then((m) => m.WishlistComponent),
     canActivate: [NonAdminGuard],
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/cart.component').then((m) => m.CartComponent),
     canActivate: [NonAdminGuard],
  },
  {
  path: 'checkout',
  loadComponent: () =>
    import('./checkout/checkout.component').then((m) => m.CheckoutComponent),
   canActivate: [NonAdminGuard],
},


  {
    path: 'order',
    loadComponent: () =>
      import('./order-history/order-history.component').then((m) => m.OrderHistoryComponent),
  // canActivate: [AuthGuard]
   canActivate: [NonAdminGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./user-profile/user-profile.component').then((m) => m.UserProfileComponent),
  canActivate: [AuthGuard,NonAdminGuard],

  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [AdminGuard],
    canLoad:[AdminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin/insert-book/insert-book.component').then((m) => m.InsertBookComponent),
      },
      {
        path: 'view-books',
        loadComponent: () =>
          import('./admin/view-books/view-books.component').then((m) => m.ViewBooksComponent),
       //  canActivate: [NonAdminGuard],
      },
      {
        path: 'view-orders',
        loadComponent: () =>
          import('./admin/view-orders/view-orders.component').then((m) => m.ViewOrdersComponent),
         //canActivate: [NonAdminGuard],
      },
    ],
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'reset-password/:token',
    loadComponent: () =>
      import('./reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'oauth-success',
    loadComponent: () =>
      import('./oauth-success/oauth-success.component').then((m) => m.OAuthSuccessComponent),
  },
  {
    path: 'notfound',
    loadComponent: () =>
      import('./not-found-page/not-found-page.component').then((m) => m.NotFoundPageComponent),
  },

  {
    path: '**',
    redirectTo: 'notfound',
  },



];
