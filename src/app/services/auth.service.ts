import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/emvironment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.API}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.API}/login`, data);
  }

  requestPasswordReset(email: string) {
    return this.http.post(`${this.API}/request-reset`, { email });
  }

  resetPassword(token: string, password: string) {
    return this.http.post(`${this.API}/reset-password/${token}`, { password });
  }

  verifyEmail(token: string) {
    return this.http.get(`${this.API}/verify-email/${token}`);
  }
}
