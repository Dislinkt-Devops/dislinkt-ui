import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoginForm, RegisterForm, UserToken } from '../model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private readonly path = 'auth';
  private readonly helper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login(loginForm: LoginForm): Observable<void> {
    return this.http.post<UserToken>(`${this.path}/login`, loginForm, { headers: this.headers })
      .pipe(map((res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      }));
  }

  register(registerForm: RegisterForm): Observable<void> {
    return this.http.post<void>(`${this.path}/register`, registerForm, { headers: this.headers })
      .pipe(map(() => {
      }));
  }
}
