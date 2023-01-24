import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileForm } from 'src/app/core/model';
import { AuthService } from 'src/app/core/service/auth.service';
import { PeopleService } from 'src/app/core/service/people.service';
import { ToastrUtils } from 'src/app/shared/utils';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss'],
})
export class ActivationComponent implements OnInit {
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [Validators.required]);
  dateOfBirth = new FormControl('', []);
  gender = new FormControl('MALE', [Validators.required]);
  bio = new FormControl('', []);
  privacy = new FormControl(true, [Validators.required]);

  constructor(
    private authService: AuthService,
    private peopleService: PeopleService,
    private router: Router,
    private toastr: ToastrUtils
  ) {}

  ngOnInit(): void {}

  async activate() {
    if (!this.isFormValid) return;

    const form: ProfileForm = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      phoneNumber: this.phoneNumber.value,
      dateOfBirth: this.dateOfBirth.value,
      gender: this.gender.value,
      bio: this.bio.value,
      privacy: this.privacy.value ? 'PUBLIC' : 'PRIVATE',
    };

    this.peopleService.addPerson(form).subscribe({
      next: () => {
        this.resetForm();
        // TODO: redirect to the next step of profile configuration
        this.toastr.showSuccessMessage(
          'Profile activated, you will be redirected to Home Page in few seconds.'
        );
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.showErrorMessageForResponse(err);
      }
    });
  }

  isFormValid(): boolean {
    return (
      this.firstName.valid &&
      this.lastName.valid &&
      this.phoneNumber.valid &&
      this.dateOfBirth.valid &&
      this.gender.valid &&
      this.bio.valid &&
      this.privacy.valid
    );
  }

  logout() {
    this.authService.logout();
  }

  resetForm(): void {
    this.firstName.reset();
    this.lastName.reset();
    this.phoneNumber.reset();
    this.dateOfBirth.reset();
    this.gender.reset();
    this.bio.reset();
    this.privacy.reset();
  }
}
