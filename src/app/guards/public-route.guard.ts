import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicRouteGuard {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.auth.isAuthenticated$.pipe(
      map((isAuthenticated) => !isAuthenticated),
      tap(
        (isAuthenticated) => !isAuthenticated && this.router.navigate(['home'])
      )
    );
  }
}
