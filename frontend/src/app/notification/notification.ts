import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BehaviorSubject } from 'rxjs';

import { NotificationObject, UserService } from '../../services/user-service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './notification.html',
  styleUrls: ['./notification.scss'],
})

export class NotificationsComponent implements OnInit, OnDestroy {

  notifications$: BehaviorSubject<NotificationObject[] | null>;

  constructor(private userService: UserService) {
    this.notifications$ = new BehaviorSubject<NotificationObject[] | null>(null)
  }

  ngOnInit(): void {
    this.userService.getNotifications().subscribe((notifs) => {
      if (notifs) {
        this.notifications$.next(notifs)
      }
    })
  }

  ngOnDestroy(): void {
    this.notifications$.unsubscribe();
  }

  deleteNotification(id: number) {
    this.userService.deletetNotifications(id).subscribe((res) => {
      if (res && this.notifications$.value) {
        const newNots: NotificationObject[] = [];
        for (let i = 0; i < this.notifications$.value.length; i++) {
          if (this.notifications$.value[i].id == id) continue;
          newNots.push(this.notifications$.value[i]);
        }
        this.notifications$.next(newNots);
      }
    });
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date == '' ? new Date() : new Date(date));
  }
}
