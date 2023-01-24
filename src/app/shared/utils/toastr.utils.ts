import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ToastrUtils {
	constructor(private toastr: ToastrService) {}

	showSuccessMessage(message: string): void {
    this.toastr.success(message, '', {
      closeButton: false,
      timeOut: 3000,
      toastClass: 'alert alert-success alert-with-icon toast-space',
    });
  }

  showErrorMessage(messages: string[]): void {
    let finalMessage = messages
      .map((x) => `${x[0].toUpperCase()}${x.substring(1)}.`)
      .join('\n');
    this.toastr.error(finalMessage, '', {
      closeButton: false,
      timeOut: 3000,
      toastClass: 'alert alert-danger alert-with-icon toast-space',
    });
  }

	showErrorMessageForResponse(err: HttpErrorResponse) {
		let messages: string[] = [];
		const errMsg: string | string[] = err.error.message || err.error.error || err.statusText;
		if (typeof errMsg === 'string') {
			messages = [errMsg];
		}
		else {
			messages = errMsg;
		}
		this.showErrorMessage(messages);
	}
}