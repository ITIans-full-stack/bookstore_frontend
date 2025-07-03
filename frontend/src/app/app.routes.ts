import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'landing',
    loadComponent: () =>
      import('./landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'bookDetails',
    loadComponent: () =>
      import('./book-details/book-details.component').then((m) => m.BookDetailsComponent),
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./wishlist/wishlist.component').then((m) => m.WishlistComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'order',
    loadComponent: () =>
      import('./order-history/order-history.component').then((m) => m.OrderHistoryComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./user-profile/user-profile.component').then((m) => m.UserProfileComponent),
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then((m) => m.AdminComponent),
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
      },
      {
        path: 'view-orders',
        loadComponent: () =>
          import('./admin/view-orders/view-orders.component').then((m) => m.ViewOrdersComponent),
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
