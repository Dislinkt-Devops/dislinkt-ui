import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { PostForm, Post, Response, TYPE, Comment, Reaction } from '../model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly path = 'posts';

  constructor(private http: HttpClient) {}

  addPost(payload: PostForm) {
    return this.http.post<any>(`${this.path}/posts`, payload).pipe(map(() => {}));
  }

  getPosts() {
    return this.http.get<Response<Post[]>>(`${this.path}/feed`);
  }

  getProfilePosts(userId: string | undefined) {
    return this.http.get<Response<Post[]>>(`${this.path}/profile-posts/${userId}`);
  }

  like(postId: string, personId: string) {
    let body = {
      type: TYPE.Like,
      personId: personId,
      postId: postId
    };
    return this.http.put<boolean>(`${this.path}/reactions/toggle`, body);
  }

  dislike(postId: string, personId: string) {
    let body = {
      type: TYPE.Dislike,
      personId: personId,
      postId: postId
    };
    return this.http.put<boolean>(`${this.path}/reactions/toggle`, body);
  }

  comment(postId: string, personId: string, text: string) {
    let body = {
      text,
      personId: personId,
      postId: postId
    };
    return this.http.post<Response<Comment>>(`${this.path}/comments`, body);
  }

  getPostReactions(postId: string) {
    return this.http.get<Response<Reaction[]>>(`${this.path}/reactions/${postId}`);
  }
}
