import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { LoginForm, RegisterForm, UserInfo, UserToken } from '../model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_ACCESS_NAME = 'accessToken';
  private readonly STORAGE_REFRESH_NAME = 'refreshToken';
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  private readonly path = 'auth';
  private readonly helper = new JwtHelperService();

  private userToken: UserInfo | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.extractToken();
    if (this.userToken && this.userToken.expiresIn < new Date().getTime()) {
      this.logout();
    }
  }

  extractToken(): void {
    let accessToken = localStorage.getItem(this.STORAGE_ACCESS_NAME);
    if (accessToken) {
      let decoded = this.helper.decodeToken(accessToken);

      this.userToken = {
        isActive: decoded.isActive,
        accessToken: accessToken,
        expiresIn: decoded.exp * 1000,
        username: decoded.username,
        role: decoded.role,
      } as UserInfo;
    }
  }

  login(loginForm: LoginForm): Observable<void> {
    return this.http
      .post<UserToken>(`${this.path}/login`, loginForm)
      .pipe(
        map((res) => {
          localStorage.setItem(this.STORAGE_ACCESS_NAME, res.accessToken);
          localStorage.setItem(this.STORAGE_REFRESH_NAME, res.refreshToken);

          this.extractToken();
        })
      );
  }

  register(registerForm: RegisterForm): Observable<void> {
    return this.http
      .post<void>(`${this.path}/register`, registerForm)
      .pipe(map(() => {}));
  }

  logout(): void {
    this.userToken = null;
    localStorage.removeItem(this.STORAGE_ACCESS_NAME);
    localStorage.removeItem(this.STORAGE_REFRESH_NAME);
    this.router.navigate(['']);
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem(this.STORAGE_REFRESH_NAME);

    this.http
      .post<UserToken>(`${this.path}/refresh`, { refreshToken })
      .subscribe({
        next: (res) => {
          localStorage.setItem(this.STORAGE_ACCESS_NAME, res.accessToken);
          this.extractToken();
        },
      });
  }

  getUserInfo(): UserInfo | null {
    return this.userToken;
  }
}
