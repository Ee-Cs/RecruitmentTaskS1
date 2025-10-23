import { inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, Observable, startWith, switchMap, BehaviorSubject } from 'rxjs';

import { Launchpad } from 'models/launchpad';
import { LaunchpadService } from 'services/launchpad-service/launchpad.service';
/**
 * Data source for the Launchpad Table view and Form view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class LaunchpadDataSource extends DataSource<Launchpad> {
  private launchpadService: LaunchpadService = inject(LaunchpadService);
  launchpads: Launchpad[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filteredLength = 0;
  private filterSubject = new BehaviorSubject<string>('');
  private lastFilter = '';
  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   *
   * @returns An observable of the items to be rendered by the table.
   */
  connect(): Observable<Launchpad[]> {
    if (!this.paginator || !this.sort) {
      const msg = 'Please set the paginator and sort on the data before connecting.';
      console.log('LaunchpadDataSource.connect(): %s', msg);
      throw Error(msg);
    }
    return this.launchpadService.getLaunchpads().pipe(
      switchMap((docs: Launchpad[]) => {
        this.launchpads = docs;
        const paginator$ = this.paginator!.page;
        const sort$ = this.sort!.sortChange;
        const filter$ = this.filterSubject.asObservable();
        return merge(paginator$, sort$, filter$).pipe(
          startWith({}),
          map(() => {
            const filtered = this.getFilteredData([...this.launchpads]);
            this.filteredLength = filtered.length;
            const sorted = this.getSortedData(filtered);
            return this.getPagedData(sorted);
          })
        );
      })
    );
  }
  /**
   * Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   *
   * @returns void
   */
  disconnect(): void {
    // No resources to clean up in this implementation.
  }
  /**
   * Set the filter string. Emits into the internal subject and stores the value
   * for use during filtering.
   */
  setFilter(value: string) {
    this.lastFilter = value ?? '';
    this.filterSubject.next(this.lastFilter);
    // Reset paginator to first page when filter changes
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
  /**
   * Filter the data by name and region (case-insensitive). If the filter is empty
   * returns the original array.
   */
  private getFilteredData(launchpads: Launchpad[]): Launchpad[] {
    const filter = this.lastFilter?.trim().toLowerCase() ?? '';
    if (!filter) {
      return launchpads;
    }
    return launchpads.filter(lp => {
      const name = (lp.name ?? '').toLowerCase();
      const region = (lp.region ?? '').toLowerCase();
      return name.includes(filter) || region.includes(filter);
    });
  }
  /**
   * Paginate the data (client-side). This method slices the data array based on the current
   * page index and page size. If you switch to using server-side pagination, this method
   * should be replaced with a call to the server to fetch the appropriate page of data.
   *
   * @param launchpads The array of launchpads to be paginated.
   * @returns The paginated array of launchpads.
   */
  private getPagedData(launchpads: Launchpad[]): Launchpad[] {
    if (!this.paginator) {
      return launchpads;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return launchpads.slice(startIndex, startIndex + this.paginator.pageSize);
  }
  /**
   * Sort the data (client-side). This method sorts the data array based on the active
   * sort field and direction. If you switch to using server-side sorting, this method
   * should be replaced with a call to the server to fetch the appropriately sorted data.
   *
   * @param launchpads The array of launchpads to be sorted.
   * @returns The sorted array of launchpads.
   */
  private getSortedData(launchpads: Launchpad[]): Launchpad[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return launchpads;
    }
    return launchpads.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      console.log('active[' + this.sort?.active + '], direction[' + this.sort?.direction + ']');
      switch (this.sort?.active) {
        case 'id':
          return this.compare(a.id, b.id, isAsc);
        case 'name':
          return this.compareIgnoreCase(a.name, b.name, isAsc);
        case 'region':
          return this.compareIgnoreCase(a.region, b.region, isAsc);
        case 'status':
          return this.compareIgnoreCase(a.status, b.status, isAsc);
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
