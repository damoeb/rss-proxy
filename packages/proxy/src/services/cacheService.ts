import Memcached from 'memcached';

import {config} from '../config';
import logger from '../logger';

export const cacheService = new class CacheService {
  private memcached: Memcached;

  constructor() {
    this.memcached = new Memcached('localhost:11211', {retries: 10, retry: 5000});
  }

  public get<T>(key: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (!config.cache.enabled) {
        reject('Cache disabled');
      }
      try {
        this.memcached.get(key, (err, data) => {
          if (err || !data) {
            reject(err);
          } else {
            resolve(data as T);
          }
        });
      } catch (e) {
        logger.error('Unable to access cache', e);
        reject(e);
      }
    });
  }

  public put<T>(key: string, data: T): void {
    try {
      this.memcached.set(key, data, config.cache.lifetimeSec, (err) => {
        if (err) {
          console.error(err);
        }
      });
    } catch (e) {
      logger.error('Unable to cache response', e);
    }
  }

  public active(): boolean {
    return config.cache.enabled;
  }
};
