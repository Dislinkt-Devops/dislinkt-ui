import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UserImagesUtils {

	getImageForName(firstName: string, lastName: string, size: number = 60, rounded: boolean = true) {
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&rounded=${rounded}&size=${size}`;
  }
}