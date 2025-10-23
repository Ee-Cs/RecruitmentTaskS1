import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Launchpad } from 'models/launchpad';
import { QueryResult } from 'services/query-result';
import { ENDPOINTS } from 'services/backend-endpoints.constants';

/**
 * Service for managing launchpads.
 * This service provides methods to create, read, update, and delete launchpads.
 * It uses local storage to persist launchpad data across sessions.
 * It also interacts with the LaunchService to manage launches associated with launchpads.
 */
@Injectable({
  providedIn: 'root',
})
export class LaunchpadService {
  http = inject(HttpClient);
  /**
   * Gets the launchpad array.
   * Retrieves the launchpad array from local storage,
   * parses it from JSON format,
   * and returns it as an array of Launchpad objects.
   * If the storage is empty, it returns an empty array.
   *
   * @returns an array of Launchpad objects
   */
  getLaunchpads(): Observable<Launchpad[]> {

    const query = {
      "query": {
      },
      "options": {
        "limit": 10,
        "sort": {
          "name": "asc"
        }
      }
    };
    return this.http.post(ENDPOINTS.queryLaunchpads(), query).pipe(
      map(result => {
        const queryResult = result as QueryResult;
        return queryResult.docs as Launchpad[];
      })
    );
  }
}
