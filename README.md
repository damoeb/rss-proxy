# RSS-proxy 

[![Build Status](https://app.travis-ci.com/damoeb/rss-proxy.svg?branch=master)](https://app.travis-ci.com/damoeb/rss-proxy)

RSS-proxy 2+ allows you to do create an ATOM or JSON feed of almost static/dynamic websites or feeds, 
purely by analyzing just the HTML structure. Try the [live demo](https://rssproxy.migor.org/).
The server is completely stateless - it does not store anything - everything is part of the url.

It is a UI for [richRSS](https://github.com/damoeb/rich-rss) middleware with the no-database profile.

![Playground](https://github.com/damoeb/rss-proxy/raw/master/docs/rssproxy-candidates.png "Playground")

## Quickstart using docker-compose

If you have [docker](https://docs.docker.com/install/) or [podman](https://podman.io/getting-started/installation) installed,
Start rss-proxy and puppeteer like this.

```
wget https://raw.githubusercontent.com/damoeb/rss-proxy/master/docker-compose.yml
docker-compose up
```

Then open [localhost:8080](http://localhost:8080) in the browser.

## Consumer Features
- Web to Feed
- Dynamic rendering using headless chromium
- Content Recovery using [JSON-LD](http://json-ld.org/), [OpenGraph](https://ogp.me/) 
- Fulltext extraction
- Filters
- Alerts into your feed if the feed transformation encounters problems
- Privacy: Nothing is persisted by the server
- Feed Format Conversion Any -> ATOM/JSON

## Self-Hosting Features
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
