import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { getDecodedToken } from '../utils/jwt'; // 👈 use our utility

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const decoded = getDecodedToken();

    if (decoded && decoded.role === 'admin') {
      return true;
    }

    return this.router.parseUrl('/notfound');
  }
}
