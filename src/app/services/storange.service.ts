import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorangeService {
  private key = 'mydayapp-angular';

  constructor() {}

  save(task: Task[]): void {
    localStorage.setItem(this.key, JSON.stringify(task));
  }

  readStorage() {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }
}
