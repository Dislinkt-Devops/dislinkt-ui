import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { PostForm } from '../model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly path = 'posts/posts';

  constructor(private http: HttpClient) {}

  addPost(payload: PostForm) {
    return this.http.post<any>(`${this.path}`, payload).pipe(map(() => {}));
  }
}
