import { Component, InjectionToken, inject } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
/**
 * Menu item definition for the navigation menu.
 * Each menu item includes the icon name, label text, and route path.
 */
export interface MenuItem {
  icon: string;
  label: string;
  path: string;
}
/**
 * Object representing menu items, where each key is a item keyword
 * and the value is a MenuItem object containing icon, label, and route path.
 * Used to define the navigation menu in the application.
 */
export const MENU_ITEMS: Record<string, MenuItem> = {
  Home: {
    icon: 'home',
    label: 'Home',
    path: '/home'
  },
  ManageLaunchpads: {
    icon: 'edit',
    label: 'Manage Launchpads',
    path: '/launchpad-table'
  },
  LocateImages: {
    icon: 'photo_camera',
    label: 'Locate Images',
    path: '/locate'
  },
};
/**
 * Injection token for browser storage.
 * This token is used to inject the browser's localStorage into services that require it.
 */
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});
/**
 * AppComponent is the root component of the application.
 * It serves as the main entry point for the application and contains the
 * navigation menu for the application.
 * This component uses Angular Material for styling and layout.
 * It includes a menu with options to navigate to different parts of the application,
 * such as the launchpad table.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: `./app.component.html`,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  storage = inject<Storage>(BROWSER_STORAGE);
  repositoryTypeName: string | null = null;
  title = 'RecruitmentTaskS1';
  menuItems = MENU_ITEMS;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  /**
   * Handles menu item selection and navigation.
   * This function is called when a menu item is clicked.
   *
   * @param menuItem - The menu item definition that was clicked.
   */
  menuHandler(menuItem: MenuItem) {
    this.repositoryTypeName = menuItem === MENU_ITEMS['Home'] ? null : this.storage.getItem('repositoryType');
    this.router.navigate([menuItem.path], {
      relativeTo: this.route,
    });
  }
}
