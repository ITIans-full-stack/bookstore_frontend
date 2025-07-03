import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  token: string = '';
  message: string = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit() {
    if (this.form.invalid) {
      this.message = '❌ Please fill out the form correctly.';
      return;
    }

    const { password, confirmPassword } = this.form.value;

    if (password !== confirmPassword) {
      this.message = '❌ Passwords do not match.';
      return;
    }

    this.auth.resetPassword(this.token, password).subscribe({
  next: (res: any) => {
    this.message = '✅ Password reset successfully. Redirecting to login...';
    this.success = true;
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  },
  error: (err: any) => {
    this.message = err.error.message || '❌ Failed to reset password.';
    this.success = false;
  }
});

  }
}
