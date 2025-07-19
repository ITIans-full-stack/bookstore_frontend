// import { Component, EventEmitter, Output } from '@angular/core';
// import { SearchService } from '../core/services/search.service';
// import { RouterModule } from '@angular/router';
// @Component({
//   selector: 'app-nav-bar',
//   standalone: true,
//   imports: [RouterModule],
//   templateUrl: './nav-bar.component.html',
//   styleUrl: './nav-bar.component.css'
// })
// export class NavBarComponent {
//    constructor(private searchService: SearchService) {}

//   onSearch(event: Event) {
//     const value = (event.target as HTMLInputElement).value;
//     this.searchService.setSearchTerm(value);
//   }

// }


// import { Component, OnInit } from '@angular/core';
// import { SearchService } from '../core/services/search.service';
// import { RouterModule } from '@angular/router';
// import { AuthService } from '../shared/services/auth.service';
// import { CommonModule } from '@angular/common';
// import { Observable } from 'rxjs';
// import { Router, NavigationEnd } from '@angular/router';
// import { filter } from 'rxjs/operators';
// @Component({
//   selector: 'app-nav-bar',
//   standalone: true,
//   imports: [RouterModule, CommonModule,RouterModule],
//   templateUrl: './nav-bar.component.html',
//   styleUrl: './nav-bar.component.css'
// })
// export class NavBarComponent implements OnInit {
//   isLoggedIn$!: Observable<boolean>;


// //
// showMinimalNav = false;
// showSearch = false;
//   isAdminRoute = false;


//   constructor(
//     private searchService: SearchService,
//     public authService: AuthService ,// needed for logout()
//     private router:Router,
//   ) {}

//   ngOnInit() {
//   this.isLoggedIn$ = this.authService.isLoggedIn$;

//   this.router.events.pipe(
//     filter(event => event instanceof NavigationEnd)
//   ).subscribe((event: any) => {
//     const path = event.urlAfterRedirects;

//     // ✅ Hide navbar on login, register, or any admin route
//     this.showMinimalNav =
//       path.includes('/login') ||
//       path.includes('/register') ||
//       path.startsWith('/admin');

//     // ✅ Show search only on /books or /books/:id
//     this.showSearch = path.includes('/books');
//   });
// }



//      this.router.events.subscribe(() => {
//       // Update search visibility based on the current route
//       this.showSearch = this.router.url.includes('/books');
//     });
//     this.router.events.subscribe(() => {
//       this.isAdminRoute = this.router.url.includes('/admin');
//     });





//   onSearch(event: Event) {
//     const value = (event.target as HTMLInputElement).value;
//     this.searchService.setSearchTerm(value);
//   }

//   logout() {
//   this.authService.logout();
//   this.router.navigateByUrl('/login', { replaceUrl: true }); // 👈 force redirect
// }
// }

import { Component, OnInit, inject } from '@angular/core';
import { SearchService } from '../core/services/search.service';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../core/services/services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { WishlistService } from '../core/services/services/wishlist.service';
import { CartService } from '../core/services/cartservices/cart.service';
import { BookDataService } from '../core/services/book-data.service';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;
import { NotificationService } from '../core/services/services/notification.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  showMinimalNav = false;
  showSearch = false;
  isAdminRoute = false;
  wishlistCount = 0;
  searchQuery: string = '';
  searchResults: any[] = [];
  searchInput$ = new Subject<string>();
  isNavbarOpen = false;

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  private cartService = inject(CartService);

  constructor(
    private searchService: SearchService,
    public authService: AuthService,
    private router: Router,
    private wishlistService: WishlistService,

    private bookService: BookDataService,


    private notificationService: NotificationService

  ) { }
  cartCount = 0;

  ngOnInit() {
    this.cartService.cartItemCount.subscribe(count => {
      this.cartCount = count;
    });

    this.cartService.getCart().subscribe();

    this.isLoggedIn$ = this.authService.isLoggedIn$;

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const path = event.urlAfterRedirects;


      // ✅ Hide navbar on login, register, or any admin route
      this.showMinimalNav =
        path.includes('/login') ||
        path.includes('/register') ||
        path.includes('/notfound') ||
        path.includes('/landing');


      // ✅ Show search only on /books 
      this.showSearch = path === '/books';

      if (!path.startsWith('/books')) {
        this.searchQuery = '';
        this.searchResults = [];
      }
    });

    //  this.router.events.subscribe(() => {
    //     // Update search visibility based on the current route
    //     this.showSearch = this.router.url.includes('/books');
    //   });
    this.router.events.subscribe(() => {
      this.isAdminRoute = this.router.url.includes('/admin');
    });

    this.wishlistService.wishlist$.subscribe(wishlist => {
      this.wishlistCount = wishlist.length;
    });




    this.searchInput$.pipe(debounceTime(300)).subscribe((query) => {
      if (query.length < 2) {
        this.searchResults = [];
        return;
      }
      this.bookService.searchBooks('title', query).subscribe({
        next: (res) => {
          console.log('Search result:', res);
          this.searchResults = res.data.books || [];
        },
        error: (err) => {
          console.error('Search error:', err);
          this.searchResults = [];
        },
      });

    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    console.log('Search input:', query);
    this.searchInput$.next(query);
  }

  goToBook(bookId: string) {
    this.router.navigate(['/books', bookId]);
    this.searchQuery = '';
    this.searchResults = [];
  }



  // onSearch(event: Event) {
  //   const value = (event.target as HTMLInputElement).value;
  //   this.searchService.setSearchTerm(value);
  // }
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  toggleNotificationPanel() {
    this.notificationService.toggle();
  }
}
