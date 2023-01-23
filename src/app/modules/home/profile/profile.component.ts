import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UserInfo } from 'src/app/core/model';
import { AuthService } from 'src/app/core/service/auth.service';
import { PeopleService } from 'src/app/core/service/people.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userData: any;
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
    //TEMPORARY
    const allUsers = (
      await lastValueFrom(this.peopleService.getFollowedUsers())
    ).data;

    const userId = this.userIdParam || this.userInfo?.userId

    if (userId)
      this.userData = allUsers.find(
        (user: any) => user.id === userId
      );

    if (!this.userData)
      this.router.navigate(['/'])
  }
}
