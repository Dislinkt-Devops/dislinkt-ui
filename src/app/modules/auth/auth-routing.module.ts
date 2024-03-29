import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnonymousGuard, NotActivatedGuard } from 'src/app/core/guards';
import { AuthLayoutComponent } from 'src/app/layout/auth-layout/auth-layout.component';
import { ActivationComponent } from './activation/activation.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Log in' },
        canActivate: [AnonymousGuard],
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: { title: 'Registration' },
        canActivate: [AnonymousGuard],
      },
      {
        path: 'activation',
        component: ActivationComponent,
        data: { title: 'Activation' },
        canActivate: [NotActivatedGuard],
      },
      { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
