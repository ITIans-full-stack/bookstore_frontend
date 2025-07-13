// // import { ActivatedRoute, Router } from '@angular/router';
// // import { Component, OnInit } from '@angular/core';

// // @Component({
// //   selector: 'app-oauth-success',
// //   template: '<p>Logging you in...</p>',
// // })
// // export class OauthSuccessComponent implements OnInit {
// //   constructor(private route: ActivatedRoute, private router: Router) {}

// //   ngOnInit() {
// //     const token = this.route.snapshot.queryParamMap.get('token');
// //     if (token) {
// //       localStorage.setItem('token', token); // ✅ This saves the token
// //       this.router.navigate(['/register']);  // ⛳️ Change to any protected route
// //     }
// //   }
// // }


// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-oauth-success',
//   template: `<p>Logging in...</p>`,
// })
// export class OAuthSuccessComponent implements OnInit {
//   constructor(private route: ActivatedRoute, private router: Router) {}

//   ngOnInit() {
//     const token = this.route.snapshot.queryParamMap.get('token');
//     if (token) {
//       localStorage.setItem('token', token);
//       this.router.navigate(['/home']); // or dashboard/profile
//     } else {
//       this.router.navigate(['/login']);
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/services/auth.service';

@Component({
  selector: 'app-oauth-success',
  standalone: true,
  imports: [CommonModule],
  template: `<p>Logging in...</p>`,
})
export class OAuthSuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      localStorage.setItem('token', token);                // ✅ Save token
      this.authService.setToken(token);                    // ✅ Update auth state

      const decoded = this.decodeToken(token);             // ✅ Check role
      if (decoded?.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/home']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch {
      return null;
    }
  }
}
