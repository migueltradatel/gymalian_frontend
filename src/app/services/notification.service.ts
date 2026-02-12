import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationsSubject = new BehaviorSubject<any[]>([]);
    public notifications$ = this.notificationsSubject.asObservable();
    private unreadCountSubject = new BehaviorSubject<number>(0);
    public unreadCount$ = this.unreadCountSubject.asObservable();

    constructor(private api: ApiService) {
        this.fetchNotifications();
        // Poll every 60 seconds for demo (Real apps use WebSockets)
        setInterval(() => this.fetchNotifications(), 60000);
    }

    fetchNotifications() {
        this.api.get('/notifications').subscribe(notifs => {
            this.notificationsSubject.next(notifs);
            const unread = notifs.filter((n: any) => !n.read).length;
            this.unreadCountSubject.next(unread);
        });
    }

    markAsRead(id: string) {
        return this.api.put(`/notifications/${id}/read`, {}).pipe(
            tap(() => this.fetchNotifications())
        );
    }

    markAllAsRead() {
        return this.api.put('/notifications/read-all', {}).pipe(
            tap(() => this.fetchNotifications())
        );
    }
}
