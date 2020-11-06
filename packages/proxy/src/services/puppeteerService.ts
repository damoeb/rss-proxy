import puppeteer, {Browser, Page} from 'puppeteer';

// todo use blocklist to speed up https://github.com/jmdugan/blocklists/tree/master/corporations
export class PuppeteerService {

  async launchBrowser(): Promise<Browser> {
    // see https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md
    // todo restart chrome/worker from time to time to prevent memory leaks
    return puppeteer.launch({
      headless: true,
      timeout: 10000,
      // dumpio: config.debug,
      args: [
        '--disable-dev-shm-usage',
        // '--disable-background-networking',
        // Disable installation of default apps on first run
        '--disable-default-apps',
        // Disable all chrome extensions entirely
        '--disable-extensions',
        // Disable the GPU hardware acceleration
        '--disable-gpu',
        // Disable syncing to a Google account
        '--disable-sync',
        // Disable built-in Google Translate service
        '--disable-translate',
        // Hide scrollbars on generated images/PDFs
        // '--hide-scrollbars',
        // Disable reporting to UMA, but allows for collection
        // '--metrics-recording-only',
        // Mute audio
        '--mute-audio',
        // Skip first run wizards
        '--no-first-run',
        // Disable sandbox mode
        // '--no-sandbox',
        // Expose port 9222 for remote debugging
        //  '--remote-debugging-port=9222',
        // Disable fetching safebrowsing lists, likely redundant due to disable-background-networking
        '--safebrowsing-disable-auto-update',
      ]
    });
  }

  private async createPage(): Promise<Page> {
    const browser = await this.launchBrowser();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    await page.setCacheEnabled(false);
    await page.setBypassCSP(true);
    page.on('request', (req: any) => {
      if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
        req.abort();
      } else {
        req.continue();
      }
    });
    return page;
  }

  public async getMarkup(url: string): Promise<string> {
    const page = await this.createPage();
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    const markup = await page.evaluate(() => {
      return document.documentElement.innerHTML;
    });

    page.browser().close().catch(console.error);

    return markup;
  }
}

export default new PuppeteerService();
