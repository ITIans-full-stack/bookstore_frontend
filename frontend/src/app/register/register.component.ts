// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// //import { AuthService } from 'src/app/shared/services/auth.service';
// import { AuthService } from '../core/services/services/auth.service';


// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [ReactiveFormsModule,CommonModule,RouterModule,FormsModule],
//   templateUrl: './register.component.html',
//   styleUrl: './register.component.css'
// })

// export class RegisterComponent {
//   registerForm: FormGroup;
// bubbles = new Array(15); // Adjust number of bubbles if needed

//   constructor(private fb: FormBuilder
//     ,private auth:AuthService
//   ) {
//     this.registerForm = this.fb.group(
//       {
//         name: ['', Validators.required],
//         email: ['', [Validators.required, Validators.email]],
//         password: ['', [Validators.required, Validators.minLength(6)]],
//         confirmPassword: ['', Validators.required]
//       },
//       {
//         validators: this.passwordMatchValidator
//       }
//     );
//   }

//   passwordMatchValidator(formGroup: FormGroup) {
//     const password = formGroup.get('password')?.value;
//     const confirm = formGroup.get('confirmPassword')?.value;
//     if (password !== confirm) {
//       formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
//     } else {
//       formGroup.get('confirmPassword')?.setErrors(null);
//     }
//   }



//   get f() {
//     return this.registerForm.controls;
//   }


//   ///===========================
//   showToast = false;
// toastMessage = '';
// toastType: 'success' | 'error' = 'success';

// showToastMessage(message: string, type: 'success' | 'error') {
//   this.toastMessage = message;
//   this.toastType = type;
//   this.showToast = true;

//   setTimeout(() => {
//     this.showToast = false;
//   }, 4000);
// }

// hideToast() {
//   this.showToast = false;
// }


// onSubmit() {
//   if (this.registerForm.invalid) return;

//   const { name, email, password } = this.registerForm.value;

//   this.auth.register({ name, email, password }).subscribe({
//     next: () => {
//       this.showToastMessage('Registration successful. Check your email.', 'success');
//     },
//     error: (err) => {
//       console.error('Register error:', err);
//       this.showToastMessage(err.error.message || 'Registration failed', 'error');
//     }
//   });
// }




// }


// src/app/register/register.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  bubbles = new Array(15); // For animated background

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
          ]
        ],
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
    if (this.registerForm.invalid) return;

    const { name, email, password } = this.registerForm.value;

    this.auth.register({ name, email, password }).subscribe({
      next: () => {
        this.showToastMessage('Registration successful. Check your email.', 'success');
      },
      error: (err) => {
        console.error('Register error:', err);
        this.showToastMessage(err.error.message || 'Registration failed', 'error');
      }
    });
  }
}