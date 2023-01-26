import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Attribute, PersonInfo, Type, UserInfo } from 'src/app/core/model';
import { AttributesService } from 'src/app/core/service/attributes.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { PeopleService } from 'src/app/core/service/people.service';
import { ToastrUtils, UserImagesUtils } from 'src/app/shared/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userData!: PersonInfo;
  userInfo: UserInfo | null = null;
  userIdParam: string | null = null;
  isBlocked: Boolean = false;
  isFollowed: Boolean = false;
  attributes: Attribute[] = [];
  attributeTypes = [Type.SKILLS, Type.EDUCATION, Type.EXPERIENCE];
  pageLoaded = false;

  constructor(
    private peopleService: PeopleService,
    private router: Router,
    private attributesService: AttributesService,
    authService: AuthService,
    route: ActivatedRoute,
    private toastr: ToastrUtils,
    private userImagesUtils: UserImagesUtils
  ) {
    this.userInfo = authService.getUserInfo();
    this.userIdParam = route.snapshot.queryParamMap.get('id');
  }

  async ngOnInit(): Promise<void> {
    if (this.userIdParam) {
      // temp solution
      const allUsers = (await lastValueFrom(this.peopleService.getAllUsers()))
        .data;

      const user = allUsers.find((user: any) => user.id === this.userIdParam);
      if (user) this.userData = user;
      else this.router.navigate(['/']);
    } else if (this.userInfo?.userId) {
      this.userData = (
        await lastValueFrom(this.peopleService.getMyProfile())
      ).data;
    }

    if (!this.userData) this.router.navigate(['/']);

    if (this.isLoggedIn()) {
      const blockedUsers = (await lastValueFrom(this.peopleService.myBlocked()))
        .data;

      this.isBlocked = !!blockedUsers.find((u) => u.id === this.userData.id);

      const followingUsers = (
        await lastValueFrom(this.peopleService.getFollowing())
      ).data;

      this.isFollowed = !!followingUsers.find((u) => u.id === this.userData.id);
    }

    this.attributes = (
      await lastValueFrom(
        this.attributesService.findByPerson(this.userInfo?.userId || '')
      )
    ).data;

    this.pageLoaded = true;
  }

  follow() {
    this.peopleService.follow(this.userData.id).subscribe({
      next: (val) => {
        const success = val.data;

        if (success) {
          this.toastr.showSuccessMessage(
            `User ${this.userData.firstName} ${this.userData.lastName} followed successfully!`
          );
          this.isFollowed = !this.isFollowed;
        } else {
          this.toastr.showErrorMessage(['Problem following user!']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.showErrorMessageForResponse(err);
      },
    });
  }

  unfollow() {
    this.peopleService.unfollow(this.userData.id).subscribe({
      next: (val) => {
        const success = val.data;

        if (success) {
          this.toastr.showSuccessMessage(
            `User ${this.userData.firstName} ${this.userData.lastName} unfollowed successfully!`
          );
          this.isFollowed = !this.isFollowed;
        } else {
          this.toastr.showErrorMessage(['Problem unfollowing user!']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.showErrorMessageForResponse(err);
      },
    });
  }

  unblock() {
    this.peopleService.unblock(this.userData.id).subscribe({
      next: (val) => {
        const success = val.data;

        if (success) {
          this.toastr.showSuccessMessage(
            `User ${this.userData.firstName} ${this.userData.lastName} unblocked successfully!`
          );
          this.isBlocked = false;
          this.isFollowed = false;
        } else {
          this.toastr.showErrorMessage(['Problem unblocking user!']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.showErrorMessageForResponse(err);
      },
    });
  }

  block() {
    this.peopleService.block(this.userData.id).subscribe({
      next: (val) => {
        const success = val.data;

        if (success) {
          this.toastr.showSuccessMessage(
            `User ${this.userData.firstName} ${this.userData.lastName} blocked successfully!`
          );
          this.isBlocked = true;
        } else {
          this.toastr.showErrorMessage(['Problem blocking user!']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.showErrorMessageForResponse(err);
      },
    });
  }

  isMyProfile(): boolean {
    return this.userData?.id === this.userInfo?.userId;
  }

  isLoggedIn(): boolean {
    return !!this.userInfo?.userId;
  }

  getImage() {
    return this.userImagesUtils.getImageForName(
      this.userData.firstName,
      this.userData.lastName,
      124
    );
  }

  filteredAttributes(type: string) {
    return this.attributes.filter((attr) => attr.attributeType === type);
  }
}
