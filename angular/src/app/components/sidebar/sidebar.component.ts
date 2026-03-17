import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/shipments', label: 'Shipments', icon: 'package' },
    { to: '/tracking', label: 'Tracking', icon: 'pin' },
    { to: '/documents', label: 'Documents', icon: 'document' },
    { to: '/analytics', label: 'Analytics', icon: 'chart' },
    { to: '/settings', label: 'Settings', icon: 'settings' },
  ];
}
