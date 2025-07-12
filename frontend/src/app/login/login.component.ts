import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { getDecodedToken } from '../shared/utils/jwt';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
//
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

bubbles = new Array(20); // 20 animated bubbles


  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.scrollToTop();
    const verified = this.route.snapshot.queryParamMap.get('verified');
    if (verified === 'true') {
      this.showToastMessage('✅ Email verified successfully. You can now log in.', 'success');
    }
  }
 scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  get f() {
    return this.loginForm.controls;
  }

  showToastMessage(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 4000);
  }

  hideToast() {
    this.showToast = false;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.showToastMessage('❌ Please fill in all required fields.', 'error');
      return;
    }


//     this.auth.login(this.loginForm.value).subscribe({
//       next: (res: any) => {
//         localStorage.setItem('token', res.token);
//        // this.router.navigate(['/home']);
//       this.auth.setToken(res.token); // 🔑 updates login state
// this.router.navigate(['/home']);

//       },
this.auth.login(this.loginForm.value).subscribe({
  next: (res: any) => {
    localStorage.setItem('token', res.token);
    this.auth.setToken(res.token);

    const decoded = getDecodedToken();

    // 🔁 Redirect based on role
    if (decoded?.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  },
      error: (err) => {
        this.showToastMessage(err.error.message || '❌ Login failed.', 'error');
      }
    });
  }

  socialLogin(provider: string) {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  }



resetEmail: string = '';

openForgotPassword() {
  const modal = new (window as any).bootstrap.Modal(document.getElementById('forgotPasswordModal'));
  modal.show();
}

submitResetEmail() {
  if (!this.resetEmail) {
    this.showToastMessage('❌ Please enter your email.', 'error');
    return;
  }

  this.auth.requestPasswordReset(this.resetEmail).subscribe({
    next: (res: any) => {
      this.showToastMessage('✅ Reset link sent to your email.', 'success');
      this.resetEmail = '';

      // ✅ Hide the modal after success
      const modalElement = document.getElementById('forgotPasswordModal');
      if (modalElement) {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide(); // Hide if already shown
      }
    },
    error: (err) => {
      this.showToastMessage(err.error.message || '❌ Failed to send reset link.', 'error');
    }
  });
}




}
