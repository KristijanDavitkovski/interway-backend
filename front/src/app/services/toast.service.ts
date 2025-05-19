import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _message = new BehaviorSubject<string | null>(null);
  message$ = this._message.asObservable();

  show(message: string) {
    this._message.next(message);
    setTimeout(() => this._message.next(null), 3000); // Auto hide
  }
}
