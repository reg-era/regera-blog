import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationObject, UserService } from '../../services/user-service';

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatCheckboxModule,
        MatDividerModule
    ],
    templateUrl: './notification.html',
    styleUrls: ['./notification.scss'],
})

export class Notifications implements OnInit {

    notifications: NotificationObject[] = [];
    _Refresh = true;

    constructor(private cdr: ChangeDetectorRef,
        private userService: UserService) { }

    ngOnInit(): void {
        this.loadNotifications();
    }

    private async loadNotifications() {
        this.notifications = (await this.userService.getNotifications()).notification;
        this._Refresh = false;

        this.cdr.markForCheck();
    }

    async deleteNotification(id: number) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index > -1) {
            const valid = await this.userService.deletetNotifications(id);
            if (valid) {
                this.notifications.splice(index, 1);
            }
        }
    }

    getTimeAgo(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
}