import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { RouteService } from 'src/app/core/service/route.service';

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

  constructor(private modalService: NgbModal, private routeService: RouteService) {
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
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
    let route = this.routeService.getActiveRoute()?.title;
    return route ?? '';
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

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe()
  }
}
