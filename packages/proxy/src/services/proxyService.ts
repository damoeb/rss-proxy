import puppeteerService from './puppeteerService';

export const proxyService = new class ProxyService {

  public async getProxiedDynamicHtml(url: string, timeoutSec: number = 20): Promise<string> {
    const timeoutMillisWithBounds = Math.min(Math.max(timeoutSec + 2, 0), 30) * 1000;
    return Promise.race([
      ProxyService.downloadDynamic(url, timeoutMillisWithBounds),
      new Promise<string>((resolve, reject) => setTimeout(() => reject(new Error(`Timeout when fetching ${url}`)), timeoutMillisWithBounds))
    ]);
  }

  private static downloadDynamic(url: string, timeoutMillis: number): Promise<string> {
    return puppeteerService.getMarkup(url, timeoutMillis)
  }
};
