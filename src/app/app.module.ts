import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { HomeLayoutComponent } from './layout/home-layout/home-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    HomeLayoutComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    CoreModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
