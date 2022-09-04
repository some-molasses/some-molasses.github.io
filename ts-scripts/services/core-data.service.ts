export class CoreDataService {
  public static publicSiteUrl: string = 'colestanley.ca';

  public static shouldRiverify = !window.location.hostname.includes('colestanley');
  public static personalName = CoreDataService.shouldRiverify ? 'River Stanley' : 'Cole Stanley';
  public static siteName: string = CoreDataService.shouldRiverify ? 'leylights.github.io' : 'colestanley.ca';
  public static siteLogoSrc: string = '/siteimages/logo.svg';
  public static favicon: string = '/siteimages/logo-invertible.svg';

  public static email: string = CoreDataService.shouldRiverify ? 'river.stanley@uwaterloo.ca' : 'me@colestanley.ca';

  public static get isDev() {
    return !(window.location.href.includes('.ca') || window.location.href.includes('.io'));
  }
}