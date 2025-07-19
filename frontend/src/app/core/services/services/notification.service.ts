import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private showNotificationsSubject = new BehaviorSubject<boolean>(false);
  showNotifications$ = this.showNotificationsSubject.asObservable();

  toggle() {
    this.showNotificationsSubject.next(true);
  }

  hide() {
    this.showNotificationsSubject.next(false);
  }
}
