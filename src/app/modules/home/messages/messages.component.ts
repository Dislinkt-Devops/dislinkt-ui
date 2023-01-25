import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, map } from 'rxjs';
import { PersonInfo } from 'src/app/core/model';
import { AuthService } from 'src/app/core/service/auth.service';
import { MessagesService } from 'src/app/core/service/messages.service';
import { PeopleService } from 'src/app/core/service/people.service';
import { ToastrUtils } from 'src/app/shared/utils';

export interface Message {
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;
  receiver: string = '';
  text = '';
  openedChat: Message[] = [];
  availableUsers: PersonInfo[] = [];

  constructor(
    private service: MessagesService,
    private peopleService: PeopleService,
    private authService: AuthService,
    private toastr: ToastrUtils
  ) {}

  async ngOnInit(): Promise<void> {
    this.availableUsers = (
      await lastValueFrom(this.peopleService.getAllUsers())
    ).data;

    this.service.getNewMessage().subscribe((message: Message) => {
      if (message) this.openedChat.push(message);
      this.scrollToBottom();
    });

    this.service.getErrorMessage().subscribe((errorMessage: string) => {
      if (errorMessage) {
        this.openedChat = [];
        this.receiver = '';
        this.toastr.showErrorMessage([errorMessage]);
      }
    });
  }

  changeToUser(id: string) {
    this.openedChat = [];
    this.receiver = id;
    this.service.emit('getMessages', {
      userId: id,
    });
  }

  sendMessage(): void {
    if (this.text) {
      this.service.emit('message', {
        receiver: this.receiver,
        content: this.text,
      });

      this.text = '';
    }
  }

  onTextChange(event: Event): void {
    const value = (event.target as any).value;
    this.text = value;
  }

  getUserName(id: string) {
    const user = this.availableUsers.find((u) => u.id === id);
    if (!user) return '';
    return user.firstName + ' ' + user.lastName;
  }

  getUserImage(id: string) {
    const user = this.availableUsers.find((u) => u.id === id);
    if (!user) return '';
    return `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&rounded=true&size=60`;
  }

  amI(userId: string) {
    return this.authService.getUserInfo()?.userId === userId;
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
