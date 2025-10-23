import { Routes } from '@angular/router';

import { HomeComponent } from 'home/home.component';
import { LaunchpadTableComponent } from './manage/tables/launchpad-table/launchpad-table.component';
import { LaunchTableComponent } from './manage/tables/launch-table/launch-table.component';
import { ImageLocateComponent } from './locate/image-locate.component';
/**
 * Application routes for the Angular application.
 * This file defines the routes for the application, including paths for
 * launchpad and launch tables, forms, and transfers.
 * Each route is associated with a specific component that will be displayed
 * when the route is activated.
 */
export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'launchpad-table',
    component: LaunchpadTableComponent,
  },
  {
    path: 'launch-table',
    
    component: LaunchTableComponent,
  },
  {
    path: 'locate',
    component: ImageLocateComponent,
  },
  // redirect to default
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
