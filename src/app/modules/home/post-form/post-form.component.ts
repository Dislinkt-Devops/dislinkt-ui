import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostForm } from 'src/app/core/model';
import { PostsService } from 'src/app/core/service/posts.service';
import { ToastrUtils } from 'src/app/shared/utils';

@Component({
  selector: 'add-post-button',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  @Input() btnText!: string;
  text = new FormControl('', [Validators.required]);
  imageUrl = new FormControl('', []);

  links = new FormArray([this.link]);
  fg = new FormGroup({
    links: this.links,
    text: this.text,
    imageUrl: this.imageUrl,
  });
  get link(): FormGroup {
    return new FormGroup({
      link: new FormControl(null),
    });
  }

  get linksFGControls(): FormGroup[] {
    return this.links.controls as FormGroup[];
  }

  constructor(
    private modalService: NgbModal,
    private postsService: PostsService,
    private toastr: ToastrUtils
  ) {}

  ngOnInit(): void {}

  addPost() {
    const form: PostForm = {
      text: this.emptyIfNull(this.text.value),
      imageUrl: this.emptyIfNull(this.imageUrl.value),
      links: this.links.value
        .map((v: any) => v.link)
        .filter((v: any) => v !== null),
    };

    this.postsService.addPost(form).subscribe({
      next: () => {
        this.fg.reset();
        this.toastr.showSuccessMessage('Post successfully added!');
        this.modalService.dismissAll();
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.showErrorMessageForResponse(err);
      },
    });
  }

  addLink(): void {
    this.links.push(this.link);
  }

  removeLink(index: number): void {
    this.links.removeAt(index);
  }

  emptyIfNull(value: string | null | undefined): string {
    return value ? value : '';
  }

  open(content: any) {
    this.modalService
      .open(content, { windowClass: 'modal-black' });
  }
}
