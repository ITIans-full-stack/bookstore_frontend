import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = environment.apiUrl + '/auth';

  // ✅ Track login state
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  register(data: any) {
    return this.http.post(`${this.API}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.API}/login`, data);
  }

  // ✅ Call this when token is received after login
  setToken(token: string) {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
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
