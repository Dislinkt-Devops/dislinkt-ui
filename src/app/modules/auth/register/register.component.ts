import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterForm } from 'src/app/core/model';
import { AuthService } from 'src/app/core/service/auth.service';
import { ToastrUtils } from 'src/app/shared/utils';

const PASSWORD_PATTERN = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  username = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(PASSWORD_PATTERN),
    Validators.minLength(4),
    this.matchValidator('confirmPassword', true)
  ]);
  confirmPassword = new FormControl('', [Validators.required, this.matchValidator('password')]);
  creds = new FormGroup({
    password: this.password,
    confirmPassword: this.confirmPassword
  })
  showPassword = false;
  confirmShowPassword = false;

  constructor(private service: AuthService, private router: Router, private toastr: ToastrUtils) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    var registerForm: RegisterForm = {
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,
      passwordConfirm: this.confirmPassword.value
    };
    this.service.register(registerForm).subscribe({
      next: () => {
        this.freezeForm();
        // TODO: redirect to the next step of profile configuration
        this.toastr.showSuccessMessage('Successfully registered, you will be redirected to the Log in page.');
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.showErrorMessageForResponse(err);
      }
    });
  }

  matchValidator(
    matchTo: string,
    reverse?: boolean
  ): ValidatorFn {
    return (control: AbstractControl):
      ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
        !!control.parent.value &&
        control.value ===
        (control.parent?.controls as any)[matchTo].value
        ? null
        : { matching: true };
    };
  }

  isFormValid(): boolean {
    return this.username.valid && this.email.valid && this.password.valid && this.confirmPassword.valid;
  }

  freezeForm(): void {
    this.username.disable();
    this.email.disable();
    this.password.disable();
    this.confirmPassword.disable();
  }
}
