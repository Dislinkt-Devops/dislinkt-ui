import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { PersonInfo, Response } from 'src/app/core/model';
import { AuthService } from 'src/app/core/service/auth.service';
import { PeopleService } from 'src/app/core/service/people.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() sideBarToggle = new EventEmitter<boolean>();

  sideBarOpen = false;
  isCollapsed = true;
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;
  closeResult = '';
  searchTxt: string = '';
  timeout: NodeJS.Timeout | undefined = undefined;
  searchProfiles: PersonInfo[] = [];

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private titleService: Title,
    private peopleService: PeopleService,
    private router: Router
  ) {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(() => {
      if (window.innerWidth > 993) {
        this.isCollapsed = true;
      }
    });
  }

  ngOnInit(): void {}

  toggleSidebar(): void {
    this.sideBarOpen = !this.sideBarOpen;
    this.sideBarToggle.emit(this.sideBarOpen);
  }

  open(content: any) {
    this.modalService
      .open(content, { windowClass: 'modal-search' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.searchTxt = '';
          this.searchProfiles = [];
        }
      );
  }

  getRouteTitle(): string {
    return this.titleService.getTitle().replace('DisLINKt - ', '');
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  isAuthenticated(): boolean {
    return this.authService.getUserInfo() !== null;
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }

  triggerSearch() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.peopleService.searchPeople(this.searchTxt).subscribe({
        next: (resp: Response<PersonInfo[]>) => {
          this.searchProfiles = resp.data;
        }
      });
    }, 500);
  }

  redirect(id: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/profile'], { queryParams: { id }});
  }
}
