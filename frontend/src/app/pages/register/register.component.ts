
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirm = formGroup.get('confirmPassword')?.value;
    if (password !== confirm) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }



  get f() {
    return this.registerForm.controls;
  }


  ///===========================
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


onSubmit() {
  if (this.registerForm.valid) {
    this.showToastMessage('✅ Registration successful!', 'success');
    console.log(this.registerForm.value);
  } else {
    this.showToastMessage('❌ Please fix form errors before submitting.', 'error');
  }
}


}
