import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { PersonInfo, UserInfo } from 'src/app/core/model';
import { AuthService } from 'src/app/core/service/auth.service';
import { PeopleService } from 'src/app/core/service/people.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userData: PersonInfo | null = null;
  userInfo: UserInfo | null = null;
  userIdParam: string | null = null;

  constructor(
    private peopleService: PeopleService,
    private router: Router,
    authService: AuthService,
    route: ActivatedRoute,
  ) {
    this.userInfo = authService.getUserInfo();
    this.userIdParam = route.snapshot.queryParamMap.get('id');
  }

  async ngOnInit(): Promise<void> {
    if (this.userIdParam) {
      // temp solution
      const allUsers = (
        await lastValueFrom(this.peopleService.getAllUsers())
      ).data;

      this.userData = allUsers.find(
        (user: any) => user.id === this.userIdParam
      ) || null;
    } else if (this.userInfo?.userId) {
      this.userData = (await lastValueFrom(this.peopleService.getMyProfile())).data
    }

    if (!this.userData)
      this.router.navigate(['/'])
  }

  isMyProfile(): boolean {
    return this.userData?.id === this.userInfo?.userId;
  }
}
