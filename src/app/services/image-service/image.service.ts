import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { QueryResult } from 'services/query-result';
import { CrewImage } from './responses/crew-image';
import { LaunchpadImage } from './responses/launchpad-image';
import { RocketImage } from './responses/rocket-image';
import { ENDPOINTS } from 'services/backend-endpoints.constants';
/**
 * Service for managing launch data.
 * This service provides methods to get images.
 */
@Injectable({
  providedIn: 'root',
})
export class ImageService {
  http = inject(HttpClient);
  /**
   * Gets the  crew images
   */
  getCrewImages(page: number, limit: number): Observable<CrewImage[]> {
    const query = {
      "query": {
      },
      "options": {
        "select": {
          "name": 1,
          "image": 1
        },
        "sort": {
          "name": "asc"
        },
        "page": page,
        "limit": limit
      }
    };
    return this.http.post(ENDPOINTS.queryCrew(), query).pipe(
      map(result => {
        const queryResult = result as QueryResult;
        return queryResult.docs as CrewImage[];
      })
    );
  }
  /**
   * Gets the  launchpad images
   */
  getLaunchpadImages(page: number, limit: number): Observable<LaunchpadImage[]> {
    const query = {
      "query": {
      },
      "options": {
        "select": {
          "name": 1,
          "images": 1
        },
        "sort": {
          "name": "asc"
        },
        "page": page,
        "limit": limit
      },
      "populate": [
        {
          "path": "images",
          "select": {
            "large": 1
          },
          "limit": 1
        }
      ]
    };
    return this.http.post(ENDPOINTS.queryLaunchpads(), query).pipe(
      map(result => {
        const queryResult = result as QueryResult;
        return queryResult.docs as LaunchpadImage[];
      })
    );
  }
  /**
   * Gets the  rocket images
   */
  getRocketImages(page: number, limit: number): Observable<RocketImage[]> {
    const query = {
      "query": {
      },
      "options": {
        "select": {
          "name": 1,
          "flickr_images": 1
        },
        "sort": {
          "name": "asc"
        },
        "page": page,
        "limit": limit,
        "populate": [
          {
            "path": "flickr_images",
            "limit": 1
          }
        ]
      }
    };
    return this.http.post(ENDPOINTS.queryRockets(), query).pipe(
      map(result => {
        const queryResult = result as QueryResult;
        return queryResult.docs as RocketImage[];
      })
    );
  }
}
