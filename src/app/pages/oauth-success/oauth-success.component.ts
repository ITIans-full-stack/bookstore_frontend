import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-oauth-success',
  template: '<p>Logging you in...</p>',
})
export class OauthSuccessComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      localStorage.setItem('token', token); // ✅ This saves the token
      this.router.navigate(['/register']);  // ⛳️ Change to any protected route
    }
  }
}
