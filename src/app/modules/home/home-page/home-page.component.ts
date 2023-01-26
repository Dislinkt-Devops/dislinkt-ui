import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/core/model';
import { AuthService } from 'src/app/core/service/auth.service';
import { PeopleService } from 'src/app/core/service/people.service';
import { PostsService } from 'src/app/core/service/posts.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  posts: Post[] = [];
  firstName = '';
  lastName = '';

  constructor(
    private authService: AuthService,
    private postsService: PostsService,
    private peopleService: PeopleService
  ) {
    this.peopleService.getMyProfile().subscribe({
      next: resp => {
          this.firstName = resp.data.firstName;
          this.lastName = resp.data.lastName;
      }
    });
  }

  ngOnInit(): void {
    this.refresh(true);
  }

  isLoggedIn() {
    return this.authService.getUserInfo() ? true : false;
  }

  refresh(value: boolean) {
    if (value) {
      this.postsService.getPosts().subscribe({
        next: (resp) => {
          this.posts = resp.data;
        },
      });
    }
  }
}
