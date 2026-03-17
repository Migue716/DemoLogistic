import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'shipments', loadComponent: () => import('./pages/shipments/shipments.component').then((m) => m.ShipmentsComponent) },
      { path: 'tracking', loadComponent: () => import('./pages/tracking/tracking.component').then((m) => m.TrackingComponent) },
      { path: 'documents', loadComponent: () => import('./pages/documents/documents.component').then((m) => m.DocumentsComponent) },
      { path: 'analytics', loadComponent: () => import('./pages/analytics/analytics.component').then((m) => m.AnalyticsComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then((m) => m.SettingsComponent) },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
