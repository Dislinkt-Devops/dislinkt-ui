import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Response, PersonInfo, ProfileForm } from '../model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private readonly path = 'posts/people';

  constructor(private http: HttpClient, private authService: AuthService) {}

  //TODO: Replace path with correct one once implemented
  getAllUsers() {
    return this.http.get<Response<PersonInfo[]>>(`${this.path}`);
  }

  getFollowing() {
    return this.http.get<Response<PersonInfo[]>>(`${this.path}/following`);
  }

  follow(id: string) {
    return this.http.put<Response<Boolean>>(`${this.path}/follow/${id}`, {});
  }

  unfollow(id: string) {
    return this.http.put<Response<Boolean>>(`${this.path}/unfollow/${id}`, {});
  }

  block(id: string) {
    return this.http.put<Response<Boolean>>(`${this.path}/block/${id}`, {});
  }

  unblock(id: string) {
    return this.http.put<Response<Boolean>>(`${this.path}/unblock/${id}`, {});
  }

  myBlocked() {
    return this.http.get<Response<PersonInfo[]>>(`${this.path}/myBlocked`);
  }

  getMyProfile() {
    return this.http.get<Response<PersonInfo>>(`${this.path}/myProfile`);
  }

  getProfile(userId: string | undefined) {
    return this.http.get<Response<PersonInfo>>(`${this.path}/profile/${userId}`);
  }

  updateProfile(payload: ProfileForm) {
    return this.http.put<Response<PersonInfo>>(`${this.path}/myProfile`, payload);
  }

  addPerson(payload: ProfileForm) {
    return this.http.post<any>(`${this.path}`, payload).pipe(
      map(() => {
        this.authService.refreshToken();
      })
    );
  }

  searchPeople(keyword: string) {
    return this.http.get<Response<PersonInfo[]>>(`${this.path}/search`, { params: { keyword } });
  }
}
