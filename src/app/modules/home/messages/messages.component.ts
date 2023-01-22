import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, map } from 'rxjs';
import { MessagesService } from 'src/app/core/service/messages.service';
import { PeopleService } from 'src/app/core/service/people.service';

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
  receiver: string = '';
  text = '';
  openedChat: Message[] = [];
  availableUsers: any[] = [];

  constructor(
    private service: MessagesService,
    private peopleService: PeopleService
  ) {}

  async ngOnInit(): Promise<void> {
    this.availableUsers = (
      await lastValueFrom(this.peopleService.getFollowedUsers())
    ).data;

    this.service.getNewMessage().subscribe((message: Message) => {
      if (message) this.openedChat.push(message);
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
    return user.firstName + ' ' + user.lastName;
  }
}
