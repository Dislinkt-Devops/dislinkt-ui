import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private readonly path = 'posts/people';

  constructor(private http: HttpClient, private authService: AuthService) {}

  //TODO: Replace path with correct one once implemented
  getFollowedUsers() {
    return this.http.get<any>(`${this.path}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authService.getUserInfo()?.accessToken || '',
      },
    });
  }
}
