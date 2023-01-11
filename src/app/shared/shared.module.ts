import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    RouterModule,
    NgbModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    FontAwesomeModule,
    RouterModule
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
      faBell
    );
  }
}
