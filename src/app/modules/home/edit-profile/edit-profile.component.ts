import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { RegisterForm, UserInfo } from 'src/app/core/model';
import { AuthService } from 'src/app/core/service/auth.service';
import { PeopleService } from 'src/app/core/service/people.service';

const PASSWORD_PATTERN =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  userData: any;
  userInfo: UserInfo | null = null;
  username = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(20),
  ]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(PASSWORD_PATTERN),
    Validators.minLength(4),
    this.matchValidator('confirmPassword', true),
  ]);
  confirmPassword = new FormControl('', [
    Validators.required,
    this.matchValidator('password'),
  ]);
  constructor(
    private peopleService: PeopleService,
    private authService: AuthService
  ) {
    this.userInfo = authService.getUserInfo();
    this.username.setValue(this.userInfo?.username);
    this.email.setValue(this.userInfo?.email);
  }

  async ngOnInit(): Promise<void> {
    //TEMPORARY
    this.userData = (
      await lastValueFrom(this.peopleService.getFollowedUsers())
    ).data[0];
  }

  async submitAuthSettings() {
    const authForm: RegisterForm = {
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,
      passwordConfirm: this.confirmPassword.value,
    };
    if (this.password.touched || this.confirmPassword.touched)
      await lastValueFrom(this.authService.changePassword(authForm));
    if (this.username.touched || this.email.touched)
      await lastValueFrom(this.authService.updateUser(authForm));
  }

  private matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
        !!control.parent.value &&
        control.value === (control.parent?.controls as any)[matchTo].value
        ? null
        : { matching: true };
    };
  }
}
