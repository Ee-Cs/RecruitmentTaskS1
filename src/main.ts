import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
/**
 * Main entry point for the Angular application.
 * This file bootstraps the application with the root component and configuration.
 * It uses the `bootstrapApplication` function to start the application
 * with the provided `AppComponent` and `appConfig`.
 *
 * @returns void
 */
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
