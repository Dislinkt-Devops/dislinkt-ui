import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MessagesComponent } from './messages/messages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { PostFormComponent } from './post-form/post-form.component';
import { EntryModalComponent } from './entry-modal/entry-modal.component';


@NgModule({
  declarations: [
    HomePageComponent,
    MessagesComponent,
    EditProfileComponent,
    ProfileComponent,
    PostFormComponent,
    EntryModalComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class HomeModule { }
