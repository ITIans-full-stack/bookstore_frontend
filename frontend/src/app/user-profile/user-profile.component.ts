import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../core/services/services/user.service';
import { AuthService } from '../core/services/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  bubbles = new Array(20);
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  @ViewChild('toastRef', { static: false }) toastEl!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      passwordGroup: this.fb.group(
        {
          newPassword: [''],
          confirmNewPassword: [''],
        },
        { validators: this.matchPasswords }
      ),
    });
  }

  ngOnInit(): void {
    // 🔒 Prevent loading if logged out
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // Load user data
    this.userService.getUser().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
        });
      },
      error: (err: any) => {
        this.showToast('❌ Failed to load user info', 'error');
        console.error(err);
      },
    });
  }



  get userName(): string {
    return this.profileForm.get('name')?.value;
  }

  matchPasswords(group: FormGroup) {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmNewPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  updateProfile() {
    const name = this.profileForm.value.name;
    const email = this.profileForm.value.email;
    const password = this.profileForm.value.passwordGroup.newPassword;

    const payload: any = { name, email };
    if (password) payload.password = password;

    this.userService.updateUserProfile(payload).subscribe({
      next: () => {
        this.showToast('✅ Profile updated successfully!', 'success');
      },
      error: (err: any) => {
        this.showToast('❌ Failed to update profile', 'error');
        console.error(err);
      },
    });
  }

  logout() {
    this.authService.logout();
    this.profileForm.reset(); // Clear form manually
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }



  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    if (this.toastEl) {
      const toast = new bootstrap.Toast(this.toastEl.nativeElement);
      toast.show();
    }
  }
}
