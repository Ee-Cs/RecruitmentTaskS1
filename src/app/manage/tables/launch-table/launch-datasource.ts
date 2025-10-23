import { inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, Observable, startWith, switchMap, BehaviorSubject } from 'rxjs';

import { Launch } from 'models/launch';
import { LaunchService } from 'services/launch-service/launch.service';
/**
 * Data source for the Launch Table view and Form view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class LaunchDataSource extends DataSource<Launch> {
  private launchService: LaunchService = inject(LaunchService);
  launches: Launch[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  launchpadId = '';
  filteredLength = 0;
  private filterSubject = new BehaviorSubject<string>('');
  private lastFilter = '';
  /**
   * Sets the launchpad id.
   *
   * @param launchpadId the launchpad id
   */
  setLaunchpadId(launchpadId: string) {
    this.launchpadId = launchpadId;
  }
  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   *
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Launch[]> {
    if (!this.paginator || !this.sort) {
      const msg = 'Please set the paginator and sort on the data before connecting.';
      console.log('LaunchDataSource.connect(): launchpadId[%s], ', this.launchpadId, msg);
      throw Error(msg);
    }
    return this.launchService.getLaunches(this.launchpadId).pipe(
      switchMap((docs: Launch[]) => {
        this.launches = docs;
        const paginator$ = this.paginator!.page;
        const sort$ = this.sort!.sortChange;
        const filter$ = this.filterSubject.asObservable();
        return merge(paginator$, sort$, filter$).pipe(
          startWith({}),
          map(() => {
            const filtered = this.getFilteredData([...this.launches]);
            this.filteredLength = filtered.length;
            const sorted = this.getSortedData(filtered);
            return this.getPagedData(sorted);
          })
        );
      })
    );
  }
  /**
   * Called when the table is being destroyed. Use this function to clean up
   * any open connections or free any held resources that were set up during connect.
   * This is a no-op in this implementation, as there are no resources to clean up.
   *
   * @return void
   */
  disconnect(): void {
    // No resources to clean up
  }
  /**
   * Set the filter string. Emits into the internal subject and stores the value
   * for use during filtering.
   */
  setFilter(value: string) {
    this.lastFilter = value ?? '';
    this.filterSubject.next(this.lastFilter);
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
  /**
   * Filter the data by name (case-insensitive). If the filter is empty
   * returns the original array.
   */
  private getFilteredData(launches: Launch[]): Launch[] {
    const filter = this.lastFilter?.trim().toLowerCase() ?? '';
    if (!filter) {
      return launches;
    }
    return launches.filter(obj => {
      const name = (obj.name ?? '').toLowerCase();
      return name.includes(filter);
    });
  }
  /**
   * Paginates the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   *
   * @param launches The array of launches to be paginated.
   * @returns The paginated array of launches.
   */
  private getPagedData(launches: Launch[]): Launch[] {
    if (!this.paginator) {
      return launches;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return launches.splice(startIndex, this.paginator.pageSize);
  }
  /**
   * Sort the data (client-side). This method sorts the data array based on the active
   * sort field and direction. If you switch to using server-side sorting, this method
   * should be replaced with a call to the server to fetch the appropriately sorted data.
   *
   * @param launchpads The array of launchpads to be sorted.
   * @returns The sorted array of launchpads.
   */
  private getSortedData(launches: Launch[]): Launch[] {

    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return launches;
    }
    return launches.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'id':
          return this.compare(a.id, b.id, isAsc);
        case 'name':
          return this.compareIgnoreCase(a.name, b.name, isAsc);
        case 'wikipedia':
          return this.compareIgnoreCase(a.links?.wikipedia, b.links?.wikipedia, isAsc);
        case 'success':
          return this.compare(a.success.toString(), b.success.toString(), isAsc);
        default:
          return 0;
      }
    });
  }
  /**
   * Compare two values and return a number indicating their relative order.
   * This function is used for sorting the data in the table.
   */
  private compareIgnoreCase(
    a: string,
    b: string,
    isAsc: boolean
  ): number {
    return this.compare((a ?? '').toUpperCase(), (b ?? '').toUpperCase(), isAsc);
  }
  /**
   * Compare two values and return a number indicating their relative order.
   * This function is used for sorting the data in the table.
   */
  private compare(
    a: string | number,
    b: string | number,
    isAsc: boolean
  ): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
