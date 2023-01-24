import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotActivatedGuard } from 'src/app/core/guards';
import { HomeLayoutComponent } from 'src/app/layout/home-layout/home-layout.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
        data: { title: 'Feed' },
      },
      {
        path: 'messages',
        component: MessagesComponent,
        data: { title: 'Messages' },
        canActivate: [NotActivatedGuard],
      },
      {
        path: 'edit-profile',
        component: EditProfileComponent,
        data: { title: 'Edit Profile' },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'Profile' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
