import { ChangeDetectionStrategy, Component, InjectionToken, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

/**
 * Injection token for browser storage.
 * This token is used to inject the browser's localStorage into services that require it.
 */
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});
/**
 * Dialog displaying error message.
 */
@Component({
  template: `<h2 mat-dialog-title>Error</h2>
    <mat-dialog-content>
      <p>Backend server failed</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton mat-dialog-close>OK</button>
    </mat-dialog-actions>`,
  imports: [MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ErrorMesssageDialog { }
/**
 * A component for home page.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule,
  ],
})
export class HomeComponent implements OnInit {
  storage = inject<Storage>(BROWSER_STORAGE);
  private formBuilder = inject(FormBuilder);
  homeForm = this.formBuilder.group({
  });
  dialog: MatDialog = inject(MatDialog);
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   *
   * https://angular.dev/guide/components/lifecycle#ngoninit
   * @returns void
   */
  ngOnInit() {
    console.log('🟧HomeComponent.ngOnInit():');
  }
  /**
   * Opens the error dialog when backend server fails.
   */
  private showBackendErrorDialog() {
    this.dialog.open(ErrorMesssageDialog, { width: '250px' });
  }

}
