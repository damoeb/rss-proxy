import {Readable} from "stream";

export interface HttpStream {
  stream: Readable,
  headers: object
}

export interface Constraints {
  minWords: number
  minLinks: number
  minShares: number
}

export interface Link {
  name: string,
  url: string
}


