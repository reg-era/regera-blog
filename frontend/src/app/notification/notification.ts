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

export class Notifications implements OnInit, OnDestroy {

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
    const oldNotif = this.notifications$.value
    let index = -1;
    if (!oldNotif) return;
    for (let i = 0; i < oldNotif.length; i++) {
      if (oldNotif[i].id == id) {
        index = i;
        break;
      }
    }
    if (index > -1) {
      this.userService.deletetNotifications(id).subscribe((res) => {
        if (res) {
          if (index == 0) {
            this.notifications$.next([]);
          } else {
            const newNots = oldNotif.splice(index, 1);
            if (newNots) {
              this.notifications$.next(newNots);
            }
          }
        }
      });
    }
  }
}
