// frontend/src/app/core/services/userService/user.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  getUser() {
    return this.http.get<any>(`${this.apiUrl}/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUserProfile(data: any) {
    return this.http.put<any>(`${this.apiUrl}/profile`, data, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
