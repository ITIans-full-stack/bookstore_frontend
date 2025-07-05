import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(
    public authService: AuthService ,// needed for logout()
    private router:Router,
  ) {}

   logout() {
  this.authService.logout();
  this.router.navigateByUrl('/landing', { replaceUrl: true }); 
}
}
