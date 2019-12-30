import * as request from "request";
import {Article, HttpStream, Source} from './models';

export abstract class Parser {
  abstract parse(source: Source, stream: HttpStream): Promise<Article[]>;

  static extractDomain(url: string) {
    const domainRegex = /:\/\/(.[^/]+)/;
    return url.match(domainRegex)[1];
  }

  removeTags(description: string = '') {
    return description.replace(/<[^>]+>/g, '');
  }

  abstract test(source: Source, headers: request.Headers): boolean;
}


