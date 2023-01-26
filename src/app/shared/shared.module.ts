import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { 
  faEye, 
  faEyeSlash,
  faUserGroup, 
  faNewspaper,
  faMagnifyingGlass,
  faBell,
  faXmark,
  faComments,
  faRightToBracket,
  faUserPlus,
  faThumbsUp,
  faThumbsDown,
  faComment
} from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DateAsAgoPipe } from './pipes/date-as-ago.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostComponent } from './component/post/post.component';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    DateAsAgoPipe,
    PostComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    FontAwesomeModule,
    RouterModule,
    DateAsAgoPipe,
    PostComponent,
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faEye, 
      faEyeSlash,
      faUserGroup, 
      faNewspaper,
      faMagnifyingGlass,
      faBell,
      faXmark,
      faComments,
      faRightToBracket,
      faUserPlus,
      faThumbsUp,
      faThumbsDown,
      faComment
    );
  }
}
