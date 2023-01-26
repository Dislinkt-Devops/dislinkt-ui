import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Attribute, Type } from 'src/app/core/model';
import { AttributesService } from 'src/app/core/service/attributes.service';
import { ToastrUtils } from 'src/app/shared/utils';

@Component({
  selector: 'app-entry-modal',
  templateUrl: './entry-modal.component.html',
  styleUrls: ['./entry-modal.component.scss'],
})
export class EntryModalComponent implements OnInit {
  @Input()
  public attributeType!: Type;
  @Input()
  public existing?: Attribute;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  attributeName = new FormControl('', [Validators.required]);
  attributeValue = new FormControl('', [Validators.required]);

  constructor(
    private attributesService: AttributesService,
    private toastr: ToastrUtils
  ) {}

  ngOnInit(): void {
    this.attributeName.setValue(this.existing?.attributeName);
    this.attributeValue.setValue(this.existing?.attributeValue);
  }

  passBack(value: boolean) {
    this.passEntry.emit(value);
  }

  addEntry() {
    const form: Attribute = {
      attributeName: this.attributeName.value,
      attributeValue: this.attributeValue.value,
      attributeType: this.attributeType,
    };

    const endpoint = this.existing
      ? this.attributesService.editAttribute({ ...form, id: this.existing.id })
      : this.attributesService.addAttribute(form);
    endpoint.subscribe({
      next: () => {
        this.toastr.showSuccessMessage(
          `${this.getTitle()} ${this.attributeName.value} ${
            this.existing ? 'edited' : 'added'
          } successfully.`
        );
        this.passBack(true);
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.showErrorMessageForResponse(err);
        this.passBack(false);
      },
    });
  }

  getTitle() {
    switch (this.attributeType) {
      case Type.EDUCATION:
        return 'Education';
      case Type.EXPERIENCE:
        return 'Experience';
      case Type.SKILLS:
        return 'Skill';
      default:
        return 'Entry';
    }
  }
}
