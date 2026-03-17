import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  profile = signal({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@acmecorp.com',
    company: 'Acme Corp',
  });
  prefs = signal({
    language: 'en',
    timezone: 'UTC-8',
    dateFormat: 'YYYY-MM-DD',
  });
  notifications = signal({
    emailUpdates: true,
    smsCustoms: true,
    weeklySummary: false,
    promotional: false,
  });

  updateProfile(field: string, value: string): void {
    this.profile.update((p) => ({ ...p, [field]: value }));
  }
  updatePrefs(field: string, value: string): void {
    this.prefs.update((p) => ({ ...p, [field]: value }));
  }
  updateNotifications(field: string, value: boolean): void {
    this.notifications.update((n) => ({ ...n, [field]: value }));
  }
}
