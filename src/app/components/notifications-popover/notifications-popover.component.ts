import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { PopoverController } from '@ionic/angular';

@Component({
    selector: 'app-notifications-popover',
    templateUrl: './notifications-popover.component.html',
    styleUrls: ['./notifications-popover.component.scss'],
    standalone: false
})
export class NotificationsPopoverComponent implements OnInit {
    notifications: any[] = [];

    constructor(
        public notificationService: NotificationService,
        private popoverCtrl: PopoverController
    ) { }

    ngOnInit() {
        this.notificationService.notifications$.subscribe(notifs => {
            this.notifications = notifs;
        });
    }

    markAsRead(notif: any) {
        if (!notif.read) {
            this.notificationService.markAsRead(notif._id).subscribe();
        }
    }

    markAllAsRead() {
        this.notificationService.markAllAsRead().subscribe();
    }

    close() {
        this.popoverCtrl.dismiss();
    }
}
