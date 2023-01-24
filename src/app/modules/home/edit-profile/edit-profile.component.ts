import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import {
  PersonInfo,
  ProfileForm,
  RegisterForm,
  UserInfo,
} from 'src/app/core/model';
import { AuthService } from 'src/app/core/service/auth.service';
import { PeopleService } from 'src/app/core/service/people.service';
import { ToastrUtils } from 'src/app/shared/utils';

const PASSWORD_PATTERN =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  blockedUsers: PersonInfo[] = [];
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
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [Validators.required]);
  dateOfBirth = new FormControl('', []);
  gender = new FormControl('MALE', [Validators.required]);
  bio = new FormControl('', []);
  privacy = new FormControl(true, [Validators.required]);
  constructor(
    private peopleService: PeopleService,
    private authService: AuthService,
    private toastr: ToastrUtils
  ) {
    this.userInfo = authService.getUserInfo();
    this.username.setValue(this.userInfo?.username);
    this.email.setValue(this.userInfo?.email);
  }

  async ngOnInit(): Promise<void> {
    this.peopleService.getMyProfile().subscribe({
      next: (res) => {
        this.firstName.setValue(res.data.firstName);
        this.lastName.setValue(res.data.lastName);
        this.phoneNumber.setValue(res.data.phoneNumber);
        this.dateOfBirth.setValue(formatDate(res.data.dateOfBirth, 'yyyy-MM-dd', 'en'));
        this.gender.setValue(res.data.gender);
        this.bio.setValue(res.data.bio);
        this.privacy.setValue(res.data.privacy);
      },
    });

    this.reloadBlockedUsers();
  }

  async submitAuthSettings() {
    const authForm: RegisterForm = {
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,
      passwordConfirm: this.confirmPassword.value,
    };
    // if (this.password.touched || this.confirmPassword.touched)
    //   await lastValueFrom(this.authService.changePassword(authForm));
    if (this.username.touched || this.email.touched) {
      await lastValueFrom(this.authService.updateUser(authForm));
      this.authService.refreshToken();
    }
  }

  submitEditProfile() {
    const form: ProfileForm = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      phoneNumber: this.phoneNumber.value,
      dateOfBirth: this.dateOfBirth.value,
      gender: this.gender.value,
      bio: this.bio.value,
      privacy: this.privacy.value ? 'PUBLIC' : 'PRIVATE',
    };

    this.peopleService.updateProfile(form).subscribe({
      next: () => {
        this.toastr.showSuccessMessage('Profile successfully updated!');
      },
    });
  }

  unblock(id: string) {
    this.peopleService.unblock(id).subscribe({
      next: (val) => {
        const success = val.data;

        if (success) {
          this.toastr.showSuccessMessage('User unblocked successfully!');
          this.reloadBlockedUsers();
        } else {
          this.toastr.showErrorMessage(['Problem unblocking user!']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.showErrorMessageForResponse(err);
      },
    });
  }

  private reloadBlockedUsers() {
    this.peopleService.myBlocked().subscribe({
      next: (res) => {
        this.blockedUsers = res.data;
      },
    });
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
