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


import { Component, OnInit } from '@angular/core';
import { SearchService } from '../core/services/search.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule,RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;


//
showMinimalNav = false;
showSearch = false;
  isAdminRoute = false;


  constructor(
    private searchService: SearchService,
    public authService: AuthService ,// needed for logout()
    private router:Router,
  ) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn$;

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const path = event.urlAfterRedirects;
      this.showMinimalNav = path.includes('/login') || path.includes('/register');
    });

     this.router.events.subscribe(() => {
      // Update search visibility based on the current route
      this.showSearch = this.router.url.includes('/books');
    });
    this.router.events.subscribe(() => {
      this.isAdminRoute = this.router.url.includes('/admin');
    });
  }
  
  

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchService.setSearchTerm(value);
  }

  logout() {
  this.authService.logout();
  this.router.navigateByUrl('/login', { replaceUrl: true }); // 👈 force redirect
}
}
