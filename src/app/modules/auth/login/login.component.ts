import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginForm } from 'src/app/core/model';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  showPassword = false;

  constructor(private service: AuthService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    var loginForm: LoginForm = {
      username: this.username.value,
      password: this.password.value
    };
    this.service.login(loginForm).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.showErrorMessage();
      }
    });
  }

  isFormValid(): boolean {
    return this.username.valid && this.password.valid;
  }

  showErrorMessage(): void {
    this.toastr.error('Given credentials are not valid.', '', {
      closeButton: false,
      timeOut: 3000,
      toastClass: "alert alert-danger alert-with-icon toast-space"
    });
  }
}
