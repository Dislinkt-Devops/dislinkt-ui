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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import {
  Attribute,
  PersonInfo,
  ProfileForm,
  RegisterForm,
  Type,
  UserInfo,
} from 'src/app/core/model';
import { AttributesService } from 'src/app/core/service/attributes.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { PeopleService } from 'src/app/core/service/people.service';
import { ToastrUtils, UserImagesUtils } from 'src/app/shared/utils';
import { EntryModalComponent } from '../entry-modal/entry-modal.component';

const PASSWORD_PATTERN =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  attributes: Attribute[] = [];
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
  pageLoaded = false;
  attributeTypes = [Type.SKILLS, Type.EDUCATION, Type.EXPERIENCE];

  constructor(
    private peopleService: PeopleService,
    private authService: AuthService,
    private attributesService: AttributesService,
    private toastr: ToastrUtils,
    private userImagesUtils: UserImagesUtils,
    private modalService: NgbModal
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
        this.dateOfBirth.setValue(
          formatDate(res.data.dateOfBirth, 'yyyy-MM-dd', 'en')
        );
        this.gender.setValue(res.data.gender);
        this.bio.setValue(res.data.bio);
        this.privacy.setValue(res.data.privacy);
      },
    });

    await this.loadAttributes();
    await this.reloadBlockedUsers();

    this.pageLoaded = true;
  }

  filteredAttributes(type: string) {
    return this.attributes.filter((attr) => attr.attributeType === type);
  }

  private async loadAttributes() {
    this.attributes = (
      await lastValueFrom(
        this.attributesService.findByPerson(this.userInfo?.userId || '')
      )
    ).data;
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

  unblock(person: PersonInfo) {
    this.peopleService.unblock(person.id).subscribe({
      next: async (val) => {
        const success = val.data;

        if (success) {
          await this.reloadBlockedUsers();
          this.toastr.showSuccessMessage(
            `User ${person.firstName} ${person.lastName} unblocked successfully!`
          );
        } else {
          this.toastr.showErrorMessage(['Problem unblocking user!']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.showErrorMessageForResponse(err);
      },
    });
  }

  getImage() {
    return this.userImagesUtils.getImageForName(
      this.firstName.value,
      this.lastName.value,
      124
    );
  }

  remove(attribute: Attribute) {
    this.attributesService.deleteAttribute(attribute).subscribe({
      next: () => {
        this.toastr.showSuccessMessage(`Attribute ${attribute.attributeName} successfully deleted!`)
        this.loadAttributes();
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.showErrorMessageForResponse(err);
      }
    })
  }

  open(type: string, existing?: Attribute) {
    const modalRef = this.modalService.open(EntryModalComponent, {
      windowClass: 'modal-black',
    });
    modalRef.componentInstance.attributeType = type;
    modalRef.componentInstance.existing = existing;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: boolean) => {
      if (receivedEntry === true) {
        this.loadAttributes();
      }
      modalRef.close();
    });
  }

  getEntryTitle(type: Type) {
    switch (type) {
      case Type.EDUCATION:
        return 'Education';
      case Type.EXPERIENCE:
        return 'Experience';
      case Type.SKILLS:
        return 'Skill';
      default:
        return 'Entry';
    }
  }

  private async reloadBlockedUsers() {
    this.blockedUsers = (
      await lastValueFrom(this.peopleService.myBlocked())
    ).data;
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
