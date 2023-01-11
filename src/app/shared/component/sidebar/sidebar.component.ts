import { Component, OnInit } from '@angular/core';
import { IconName } from '@fortawesome/fontawesome-svg-core';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: IconName;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/feed",
    title: "Feed",
    icon: "newspaper",
    class: ""
  },
  {
    path: "/people",
    title: "People",
    icon: "user-group",
    class: ""
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuItems: RouteInfo[] = [];

  constructor() { }

  ngOnInit(): void {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

}
