import puppeteerService from './puppeteerService';

export const proxyService = new class ProxyService {

  public async getProxiedDynamicHtml(url: string): Promise<string> {
    return Promise.race([
      ProxyService.downloadDynamic(url),
      new Promise<string>((resolve, reject) => setTimeout(() => reject(new Error(`Timeout when fetching ${url}`)), 5000))
    ]);
  }

  private static downloadDynamic(url: string): Promise<string> {
    return puppeteerService.getMarkup(url)
  }
};
