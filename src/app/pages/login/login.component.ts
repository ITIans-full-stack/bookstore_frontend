import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    const verified = this.route.snapshot.queryParamMap.get('verified');
    if (verified === 'true') {
      this.showToastMessage('✅ Email verified successfully. You can now log in.', 'success');
    }
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

    this.auth.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/register']);
      },
      error: (err) => {
        this.showToastMessage(err.error.message || '❌ Login failed.', 'error');
      }
    });
  }

  socialLogin(provider: string) {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  }
}
