import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Launch } from 'models/launch';
import { QueryResult } from 'services/query-result';
import { ENDPOINTS } from 'services/backend-endpoints.constants';
/**
 * Service for managing launch data.
 * This service provides methods to get launches
 * across launchpads.
 */
@Injectable({
  providedIn: 'root',
})
export class LaunchService {
  http = inject(HttpClient);
  /**
   * Gets the launches for a specific launchpad.
   * This method retrieves the launch array and returns the launches
   *
   * @param launchpadId the launchpad id
   * @returns an array of launches for the specified launchpad
   */
  getLaunches(launchpadId: string): Observable<Launch[]> {
    const query = {
      "query": {
        "launchpad": launchpadId
      },
      "options": {
        "limit": 200,
        "sort": {
          "name": "asc"
        }
      }
    };
    return this.http.post(ENDPOINTS.queryLaunches(), query).pipe(
      map(result => {
        const queryResult = result as QueryResult;
        return queryResult.docs as Launch[];
      })
    );
  }
}
