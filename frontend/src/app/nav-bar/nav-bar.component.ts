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

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;

  constructor(
    private searchService: SearchService,
    public authService: AuthService // needed for logout()
  ) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchService.setSearchTerm(value);
  }

  logout() {
    this.authService.logout();
  }
}
