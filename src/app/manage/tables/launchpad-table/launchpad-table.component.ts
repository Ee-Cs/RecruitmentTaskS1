import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
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

import { Launchpad } from 'models/launchpad';
import { LaunchpadDataSource } from './launchpad-datasource';
import { AppTools } from '../../../app.tools';

/**
 * LaunchpadTableComponent is a component that displays a table of launchpads.
 * It uses Angular Material's table features to display, sort, and paginate the
 * launchpad data.
 * This component also provides methods to create, update, delete launchpads,
 * and read launches associated with a launchpad.
 */
@Component({
  selector: 'app-launchpad-table',
  templateUrl: './launchpad-table.component.html',
  styleUrl: './launchpad-table.component.css',
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
export class LaunchpadTableComponent implements AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Launchpad>;
  dataSource = new LaunchpadDataSource();
  appTools = new AppTools();
  displayedColumns = ['id', 'name', 'region', 'status', 'actions'];
  /** Local input model for the search box */
  filterText = '';
  /**
   * A component lifecycle hook method.
   * Runs once after the component's view has been initialized.
   */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    console.log('🟩LaunchpadTableComponent.ngAfterViewInit():');
  }
  /**
   * Manage the launches of the launchpad.
   * This method navigates to the launch table with the specified launchpad id.
   *
   * @param id the launchpad id
   * @param name the launchpad name
   * @returns void
   */
  manageLaunches(id: string, name: string) {
    this.router.navigate(['/launch-table'], {
      relativeTo: this.route,
      queryParams: {
        id,
        name
      },
    });
    console.log('🟩LaunchpadTableComponent.manageLaunches(): launchpad id[%s]', id);
  }
  /**
   * Gets the length of the launchpads array.
   * @returns the launchpads length
   */
  get launchpadsLength(): number {
    return this.dataSource.filteredLength ?? this.dataSource.launchpads?.length ?? 0;
  }
  /**
   * Apply a filter string to the datasource (search by name and region)
   * @param value the value
   */
  applyFilter(value: string) {
    this.filterText = value ?? '';
    this.dataSource.setFilter(this.filterText);
  }
}
