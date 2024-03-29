import { Injectable } from '@angular/core';
import { RouteInfo } from '../model';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private activeRoute: RouteInfo | undefined;
  private readonly routes: RouteInfo[];

  constructor() {
    this.routes = [
      {
        path: "",
        title: "Feed",
        icon: "newspaper",
        class: "",
        needsAuth: false
      },
      {
        path: "people",
        title: "People",
        icon: "user-group",
        class: "",
        needsAuth: false
      },
      {
        path: "messages",
        title: "Messages",
        icon: "comments",
        class: "",
        needsAuth: true
      }
    ];
  }

  setActiveRoute(path: string): void {
    let route = this.routes.find(x => x.path === path);
    if (route) {
      this.activeRoute = route;
    } else {
      this.activeRoute = undefined;
    }
  }

  getActiveRoute(): RouteInfo | undefined {
    return this.activeRoute;
  }

  getRoutes(): RouteInfo[] {
    return this.routes;
  }
}
