import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})
export class HomeLayoutComponent implements OnInit {

  sidebarOpen = false;
  document: Document;

  constructor(@Inject(DOCUMENT) doc: Document) { 
    this.document = doc;
  }

  ngOnInit(): void {
  }

  onSidebarToggle(event: boolean): void {
    this.sidebarOpen = event;

    if (this.sidebarOpen) {
      this.document.documentElement.classList.add('nav-open');
    } else {
      this.document.documentElement.classList.remove('nav-open');
    }
  }
}
