import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
loginForm: FormGroup;
constructor(private fb: FormBuilder) {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
}


//===============
showToast = false;
toastMessage = '';
toastType: 'success' | 'error' = 'success';

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





onLogin() {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;

    // Simulated login logic
    if (email === 'admin@example.com' && password === '123456') {
      this.showToastMessage('✅ Login successful!', 'success');
    } else {
      this.showToastMessage('❌ Invalid email or password.', 'error');
    }

    console.log(this.loginForm.value);
  } else {
    this.showToastMessage('❌ Please fill in all required fields.', 'error');
  }
}

}


