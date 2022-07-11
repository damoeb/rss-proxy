# RSS-proxy 

[![Build Status](https://app.travis-ci.com/damoeb/rss-proxy.svg?branch=master)](https://app.travis-ci.com/damoeb/rss-proxy)

RSS-proxy 2+ allows you to do create an ATOM or JSON feed of almost static/dynamic websites or feeds (web to feed), 
just by analyzing just the HTML structure. Try the [live rss-proxy](https://rssproxy.migor.org/), keep in mind its still a beta. The prototypical version 1 [is also available](https://rssproxy-v1.migor.org/), but the algorithm had some known issues.
The server is completely stateless - it does not store anything - everything is part of the url.

It is a UI for [richRSS](https://github.com/damoeb/rich-rss) middleware with the no-database profile.

![Playground](https://github.com/damoeb/rss-proxy/raw/master/docs/rssproxy-candidates.png "Playground")

## Quickstart Version 1 using docker

Since v2 is still beta, this is the quickstart for version 1. If you have [docker](https://docs.docker.com/install/) or [podman](https://podman.io/getting-started/installation) installed,
Start rss-proxy like this.

```
docker pull damoeb/rss-proxy
docker run -p 3000:3000 -it damoeb/rss-proxy
```

Then open [localhost:3000](http://localhost:3000) in the browser.

## Quickstart Version 2 using docker-compose (Experimental)

Version 2 comes with more complexity so its easier to run it from [docker-compose](https://docs.docker.com/compose/install/). If you run the proxy behind a reverse proxy, 
make sure you set the request header "X-Real-IP" (see [nginx.con](docs/nginx.conf)) for IP throttling.  

In `docker-compose.yml` change `APP_PUBLIC_URL` accordingly which is the outfacing public url.

```
wget https://raw.githubusercontent.com/damoeb/rss-proxy/master/chrome.json
wget https://raw.githubusercontent.com/damoeb/rss-proxy/master/docker-compose.yml
docker-compose up
```

Then open [localhost:8080](http://localhost:8080) in the browser.

## Features
- Web to Feed
- Dynamic Rendering using headless chromium
- Content Recovery using [JSON-LD](http://json-ld.org/), [OpenGraph](https://ogp.me/) 
- Fulltext extraction
- Filters
- _Maintenance Alerts_ if your feed has problems
- Privacy: Nothing is persisted by the server
- Feed Format Conversion Any -> ATOM/JSON

## Other Features
- Request Throttling and Host Flooding Protection
- Caching
- Monitoring

## Migration from version 1
Version 2 supports the old version 1 urls, though this is optional. You can deactivate this feature by removing the 'legacy' profile in docker-compose.yml.

## Changelog

See [changelog](changelog.md).


## Related Projects

* [rss-bridge](https://github.com/RSS-Bridge/rss-bridge)
* [rss-guard](https://github.com/martinrotter/rssguard)
* [RSSHub](https://github.com/DIYgod/RSSHub) 

## License

This project uses the following license: [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
