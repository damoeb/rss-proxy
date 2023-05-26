# RSS-proxy 

[![Build Status](https://app.travis-ci.com/damoeb/rss-proxy.svg?branch=master)](https://app.travis-ci.com/damoeb/rss-proxy)

RSS-proxy 2+ allows you to do create an ATOM or JSON feed of almost static/dynamic websites or feeds (web to feed), 
just by analyzing just the HTML structure. It is an alternative UI to [feedless](https://github.com/damoeb/feedless) with the intent for minimalistic self-hosting with a reduced feature set of feedless.
If you want feature like fulltext feeds, aggregation, persistence, authentication and others, checkout [feedless](https://github.com/damoeb/feedless/blob/master/docs/third-party-migration.md)

![Playground](https://github.com/damoeb/rss-proxy/raw/master/docs/rssproxy-candidates.png "Playground")

## Quickstart using docker-compose

Version 2 comes with more complexity so its easier to run it from [docker-compose](https://docs.docker.com/compose/install/). If you run the proxy behind a reverse proxy,
make sure you set the request header "X-Real-IP" (see [nginx.con](docs/nginx.conf)) for IP throttling.

In `docker-compose.yml` change `APP_PUBLIC_URL` accordingly which is the outfacing public url.

```
wget https://raw.githubusercontent.com/damoeb/rss-proxy/master/chrome.json
wget https://raw.githubusercontent.com/damoeb/rss-proxy/master/docker-compose.yml
docker-compose up
```

Then open [localhost:8080](http://localhost:8080) in the browser.


## Quickstart Version 1 using docker

Since v2 is still beta, this is the quickstart for version 1. If you have [docker](https://docs.docker.com/install/) or [podman](https://podman.io/getting-started/installation) installed,
Start rss-proxy like this.

```
docker pull damoeb/rss-proxy
docker run -p 3000:3000 -it damoeb/rss-proxy
```

Then open [localhost:3000](http://localhost:3000) in the browser.

## Features
- Web to Feed
- Dynamic Rendering using headless chromium
- Filters
- Feed Format Conversion Any -> ATOM/JSON

## Migration from version 1
Version 2 supports the old version 1 urls, though this is optional. You can deactivate this feature by removing the 'legacy' profile in docker-compose.yml.

## Changelog

See [changelog](changelog.md).


## Related Projects

* [rss-bridge](https://github.com/RSS-Bridge/rss-bridge)
* [rss-guard](https://github.com/martinrotter/rssguard)

## License

This project uses the following license: [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
