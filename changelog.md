# Changelog

## 2.0.0 - 03.06.2022
- Full rewrite in kotlin

## 1.0.3 - 16.01.2021
- Remove using ids in xpaths, cause they are not abstract enough
- Bugfixes

## 1.0.2 - 09.01.2021
- Merging rules and picking the right link

## 1.0.1 - 04.01.2021
- Removes proxy endpoint
- Adds support for dynamic websites (JavaScript)

## 1.0.0 - 04.01.2021
- Improves UI to visualize feed output
- Uses XPaths instead of CSS Selectors to identify feeds
- Hardened API
- Renders parsing errors in a valid feed
- Bugfixes
- Adds Retry-After Header

## 0.4.1
- Allow short titles

## 0.4.0
- Cache layer using memcache

## 0.3.0
- analytics - [5617576](https://github.com/damoeb/rss-proxy/commit/5617576d80a69f0b5a0d5e69f4dd6d8bc7b06908)
- Correct urls pointing to old repo - [99600d1](https://github.com/damoeb/rss-proxy/commit/99600d1d944df7160cea48adc6bcf4aa6943d138)
- Bugfixes - [3f43d4a](https://github.com/damoeb/rss-proxy/commit/3f43d4a25749da476d4683bc3560e0a88fb06b24)

## 0.2.0
- Using pm2 to keep node server running after crash - [5138d25](https://github.com/damoeb/rss-proxy/commit/5138d25667934f28991cd339b3816ec1078dec3d)
- Simplify development by building the core-package automatically
- travis-ci build

### 0.1.0
- Working version

