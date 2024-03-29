import { Component, OnInit } from '@angular/core';
import { RouteInfo } from 'src/app/core/model';
import { AuthService } from 'src/app/core/service/auth.service';
import { RouteService } from 'src/app/core/service/route.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  
  menuItems: RouteInfo[];

  constructor(private routeService: RouteService, private authService: AuthService) { 
    this.menuItems = this.routeService.getRoutes();
  }

  ngOnInit(): void {
  }

  isAuthenticated(): boolean {
    return this.authService.getUserInfo() !== null;
  }
}
