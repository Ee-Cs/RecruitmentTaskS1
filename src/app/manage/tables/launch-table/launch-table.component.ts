import { AfterViewInit, Component, ViewChild, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { Launch } from 'models/launch';
import { LaunchDataSource } from './launch-datasource';
/**
 * LaunchTableComponent is a component that displays a table of launches.
 * It uses Angular Material's table features to display, sort, and paginate the
 * launch data.
 * This component also provides methods to create, update, delete launches,
 * and read details of a specific launch.
 */
@Component({
  selector: 'app-launch-table',
  templateUrl: './launch-table.component.html',
  styleUrl: './launch-table.component.css',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
})
export class LaunchTableComponent implements AfterViewInit, OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Launch>;
  launchpadId = '';
  launchpadName = '';
  dataSource = new LaunchDataSource();
  displayedColumns = ['id', 'name', 'wikipedia', 'success'];
  /** Local input model for the search box */
  filterText = '';

  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   */
  ngOnInit() {
    this.launchpadId = this.route.snapshot.queryParamMap.get('id') ?? '';
    this.launchpadName = this.route.snapshot.queryParamMap.get('name') ?? '';
    this.dataSource.setLaunchpadId(this.launchpadId);
  }
  /**
   * A component lifecycle hook method.
   * Runs once after the component's view has been initialized.
   *
   * https://angular.dev/guide/components/lifecycle#ngafterviewinit
   */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    console.log('🟩LaunchTableComponent.ngAfterViewInit():');
  }
  /**
   * Navigates to the launchpads table.
   *
   * @returns void
   */
  navigateToLaunchpads() {
    this.router.navigate(['/launchpad-table'], {
      relativeTo: this.route
    });
  }
  /**
   * gets Wikipedia title from link.
   *
   * @returns the title
   */
  getWikipediaTitle(url: string | undefined): string | undefined {
    if (!url) {
      return undefined;
    }
    const parts = url.split('/');
    return parts[parts.length - 1]?.replace('_', ' ');
  }
  /**
   * Gets the length of the launches array.
   * @returns the launchpads length
   */
  get launchesLength(): number {
    return this.dataSource.filteredLength ?? this.dataSource.launches?.length ?? 0;
  }
  /**
   * Apply a filter string to the datasource (search by name)
   * @param value the value
   */
  applyFilter(value: string) {
    this.filterText = value ?? '';
    this.dataSource.setFilter(this.filterText);
  }
}
