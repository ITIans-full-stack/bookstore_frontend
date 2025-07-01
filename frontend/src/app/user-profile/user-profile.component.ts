import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup,ReactiveFormsModule,Validators, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { UserService } from '../core/services/userService/user.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, HttpClientModule,RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.profileForm = this.fb.group({
      firstname: ['',[Validators.required, Validators.minLength(3)]],
      lastname: ['',[Validators.required, Validators.minLength(3)]],
      email: ['', Validators.email],
      address: [''],
      passwordGroup: this.fb.group({
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.matchpass})
    });
  }
   get FormControls(){
      return this.profileForm.controls;
    }
    matchpass(form: FormGroup){
      return form.get('newPassword')?.value === form.get('confirmNewPassword')?.value?null : {mismatch: true};
    }

  ngOnInit() {
    this.userService.getUser().subscribe((user) => {
      this.profileForm.patchValue({
        firstname: user.name,
        email: user.email,
      });
    });
  }
  get userName(): string {
    return this.profileForm.get('firstname')?.value;
  }

  updateProfile() {
    console.log('Updated Profile:', this.profileForm.value);
    alert('Profile updated');
  }
}
