import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { UserInfo } from 'src/app/core/model';
import { AuthService } from 'src/app/core/service/auth.service';
import { PeopleService } from 'src/app/core/service/people.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  userData: any;
  userToken: UserInfo | null = null;
  constructor(private peopleService: PeopleService, authService: AuthService) {
    this.userToken = authService.getUserInfo();
  }

  async ngOnInit(): Promise<void> {
    //TEMPORARY
    this.userData = (
      await lastValueFrom(this.peopleService.getFollowedUsers())
    ).data[0];
  }
}
