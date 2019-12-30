import {Readable} from "stream";
import {Readability} from './services/puppeteerService';

export interface AtomFeedItem {
  pubdate: Date;
  categories: string[];
  summary: string;
  description: string;
  author: string;
  published: Date
  title: string
  link: string
}

export interface HttpStream {
  stream: Readable,
  headers: object
}

export interface Feed {
  // todo add stats like rel articles/t
  name?: string,
  createdAt?: Date,
  lastSuccess?: Date,
  lastFailure?: Date,
  subscriberCount?: number,
  items?: Article[]
}

export interface DirtySources {
  [group: string]: string | DirtySource
}

export interface SiteAnalysis {
  readability: Readability
  feeds?: string[]
  links: Link[]
}

export interface Source {
  parser?: String;
  url: string
  name?: string
  whitelisted?: boolean
  staged?: boolean // has to be assessed
  tags?: string[]
  filterText?: string
}

export interface DirtySource {
  why?: string;
  url: string | string[]
  name?: string
  whitelisted?: boolean
  staged?: boolean // has to be assessed
  tags?: string[]
  filterText?: string
}

export interface Constraints {
  minWords: number
  minLinks: number
  minShares: number
}

export interface ContentFeatures {
  points: Promise<number>
  linkCount: number
  wordCount: number
}

export interface Link {
  name: string,
  url: string
}

export class Article {

  // // user fields
  // rating: number = 0; // 0-1 reading progress todo implement
  // progress: number = 0; // 0-1 reading progress
  // archived: boolean = false;
  // readLater: boolean = false;
  // deleted: boolean = false;

  // content-fields
  htmlUrl: string;
  title: string;
  content: string;
  textContent: string;
  tags: string[] = [];
  author?: string;
  excerpt: string;

  // read-only
  id?: string;
  quality?: number;
  feedUrl?: string;
  domain: string;
  providedBy?: string[];

  // system
  createdAt: Date = new Date();
  source?: Source;
  computedScore?: number;
  features?: ContentFeatures;
  relations?: string[]
}


export interface Account {
  id: string
  registries: Registries
  tags?: string[]
  sources?: any
}
export interface Registry {
  url: string
  id?: string
}
export interface Registries {
  [name:string]: Registry
}
