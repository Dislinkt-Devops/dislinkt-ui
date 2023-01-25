import { Inject, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ReplaySubject, Subject } from 'rxjs';
import { Message } from 'src/app/modules/home/messages/messages.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService extends Socket {
  private message$: Subject<Message> = new ReplaySubject<Message>();
  private errorMessage$: Subject<string> = new ReplaySubject<string>();

  constructor(
    @Inject('BASE_API_URL') baseUrl: string,
    authService: AuthService
  ) {
    super({
      url: baseUrl,
      options: {
        extraHeaders: {
          Authorization: authService.getUserInfo()?.accessToken || '',
        },
      },
    });
  }

  getNewMessage = () => {
    this.on('message', (message: Message) => {
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };

  getErrorMessage = () => {
    this.on('exception', (errorMessage: string) => {
      this.errorMessage$.next(errorMessage);
    });

    return this.errorMessage$.asObservable();
  };
}
