/**
 * Application tools.
 */
export class AppTools {
  /**
   * Display status.
   * @param status the status
   */
  displayStatus(status: string): string {
    switch (status) {
      case 'active':
        return '🟢 ' + status;
      case 'inactive':
        return '🟠 ' + status;
      case 'unknown':
        return '🟡 ' + status;
      case 'retired':
        return '🟤 ' + status;
      case 'lost':
        return '🔴 ' + status;
      case 'under construction':
        return '⚪ ' + status;
      default:
        return status;

    }
  }
  
}