import Memcached from 'memcached';

import {config} from '../config';

export const cacheService = new class CacheService {
  private memcached: Memcached;

  constructor() {
    this.memcached = new Memcached('localhost:11211', {retries: 10, retry: 10000});
  }

  public get<T>(key: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (!config.cache.enabled) {
        reject('Cache disabled');
      }
      this.memcached.get(key, (err, data) => {
        if (err || !data) {
          reject(err);
        } else {
          resolve(data as T);
        }
      });
    });
  }

  public put<T>(key: string, data: T): void {
    this.memcached.set(key, data, config.cache.lifetimeSec, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  public active(): boolean {
    return config.cache.enabled;
  }
};
