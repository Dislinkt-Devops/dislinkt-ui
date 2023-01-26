import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post, TYPE } from 'src/app/core/model';
import { AuthService } from 'src/app/core/service/auth.service';
import { PostsService } from 'src/app/core/service/posts.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post: Post = {} as Post;
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  canInteract: boolean = false;
  public isCollapsed = true;
  isLiked = false;
  isDisliked = false;
  commentText = new FormControl('', [Validators.required]);

  constructor(private authService: AuthService, private postService: PostsService, private router: Router) {}

  ngOnInit(): void {
    this.sortComments();
    this.canInteract = this.authService.getUserInfo() != null;
    if (this.canInteract)
      this.post.reactions.forEach((x) => {
        if (x.type == TYPE.Like) {
          if (x.personId === this.authService.getUserInfo()?.userId) {
            this.isLiked = true;
            return;
          }
        } else {
          if (x.personId === this.authService.getUserInfo()?.userId) {
            this.isDisliked = true;
            return;
          }
        }
      });
  }

  sortComments(): void {
    this.post.comments = this.post.comments.sort((x, y) => y.createdAt- x.createdAt);
  }

  like(): void {
    let userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.postService.like(this.post.id, userInfo.userId).subscribe({
        next: () => {
          this.isLiked = !this.isLiked;
          this.isDisliked = false;
          this.postService.getPostReactions(this.post.id).subscribe({
            next: resp => this.post.reactions = resp.data
          });
        }
      });
    }
  }

  dislike(): void {
    let userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.postService.dislike(this.post.id, userInfo.userId).subscribe({
        next: () => {
          this.isDisliked = !this.isDisliked;
          this.isLiked = false;
          this.postService.getPostReactions(this.post.id).subscribe({
            next: resp => this.post.reactions = resp.data
          });
        }
      });
    }
  }

  comment(): void {
    let userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.postService.comment(this.post.id, userInfo.userId, this.commentText.value).subscribe({
        next: resp => {
          this.post.comments.push(resp.data);
          this.sortComments();
          this.commentText.setValue('');
        }
      });
    }
  }

  countLikes(): number {
    return this.post.reactions.filter(x => x.type === TYPE.Like).length;
  }

  countDislikes(): number {
    return this.post.reactions.filter(x => x.type === TYPE.Dislike).length;
  }

  routeToProfile(userId: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/profile'], { queryParams: { id: userId }});
  }
}
