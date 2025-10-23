const SITE = 'https://api.spacexdata.com';

/**
 * API endpoints for the backend application.
 */
export const ENDPOINTS = {
  queryLaunchpads: () =>
    `${SITE}/v4/launchpads/query`,
  queryLaunches: () =>
    `${SITE}/v5/launches/query`,
  queryRockets: () =>
    `${SITE}/v4/rockets/query`,
  queryCrew: () =>
    `${SITE}/v4/crew/query`,
};
