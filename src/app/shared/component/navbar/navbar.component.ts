import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  @Output() sideBarToggle = new EventEmitter<boolean>();

  sideBarOpen = false;
  isCollapsed = true;
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;
  closeResult = '';

  constructor(private modalService: NgbModal, private authService: AuthService, private titleService: Title) {
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe(() => {
      if (window.innerWidth > 993) {
        this.isCollapsed = true;
      }
    });
  }

  ngOnInit(): void {
  }

  toggleSidebar(): void {
    this.sideBarOpen = !this.sideBarOpen;
    this.sideBarToggle.emit(this.sideBarOpen);
  }

  open(content: any) {
    this.modalService.open(content, { windowClass: 'modal-search' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
    this.resizeSubscription$.unsubscribe()
  }
}
