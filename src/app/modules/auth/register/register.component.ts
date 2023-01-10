import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterForm } from 'src/app/core/model';
import { AuthService } from 'src/app/core/service/auth.service';

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
  showPassword: boolean = false;
  confirmShowPassword: boolean = false;

  constructor(private service: AuthService, private router: Router, private toastr: ToastrService) { }

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
        this.router.navigate(['/auth/register']);
      },
      error: (err: HttpErrorResponse) => {
        let messages: string[] = [];
        if (typeof err.error.message === 'string') {
          messages = [err.error.message];
        }
        else {
          messages = err.error.message;
        }
        this.showErrorMessage(messages);
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

  showErrorMessage(messages: string[]): void {
    let finalMessage = messages.map(x => `${x[0].toUpperCase()}${x.substring(1)}.`).join('\n');
    this.toastr.error(finalMessage, '', {
      closeButton: false,
      timeOut: 3000,
      toastClass: "alert alert-danger alert-with-icon"
    });
  }
}
