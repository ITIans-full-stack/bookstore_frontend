import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { getDecodedToken } from '../utils/jwt';

@Injectable({ providedIn: 'root' })
export class NonAdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const decoded = getDecodedToken();

    // If admin, block access to non-admin pages
    if (decoded?.role === 'admin') {
      return this.router.parseUrl('/admin');
    }

    return true; // Allow other users
  }
}
