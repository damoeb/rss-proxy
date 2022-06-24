# RSS-proxy

RSS-proxy version 2+ allows you to do create an ATOM or JSON feed of almost static/dynamic websites or feeds, 
purely by analyzing just the HTML structure. Try the [live demo](https://rssproxy.migor.org/).
The server is completely stateless - it does not store anything - everything is part of the url.

It is a UI for [richRSS](https://github.com/damoeb/rich-rss) middleware and is shipped in a multiplatform docker image.

![Playground](https://github.com/damoeb/rss-proxy/raw/master/docs/rssproxy-candidates.png "Playground")

## Quickstart using docker-compose

Requirements: [docker](https://docs.docker.com/install/) or [podman](https://podman.io/getting-started/installation).
Start rss-proxy and with the optional puppeteer for dynamic rendering

```
wget https://raw.githubusercontent.com/damoeb/rss-proxy/master/docker-compose.yml
docker-compose up
```

Then open [localhost:8080](http://localhost:8080) in the browser.

The minimal - not recommended - runtime without docker-compose would be:
```
docker pull damoeb/rss-proxy:2
docker run -e APP_PUBLIC_URL=http://localhost:8080 -e TOKEN_SECRET=1234_top_secret -p 8080:8080 -it damoeb/rss-proxy:2
```

## Features
- Automated Web to Feed
- Dynamic rendering using headless chromium
- Feed Format Conversion
- Content Recovery using [JSON-LD](http://json-ld.org/), [OpenGraph](https://ogp.me/) and fulltext extraction
- Filters
- Security
- Caching
- Alerts into your feed if the feed transformation encounters problems
- Privacy: Nothing is persisted by the server
- Monitoring

## Legacy Support


## Changelog

See [changelog](changelog.md).


## Related Projects

* [rss-bridge](https://github.com/RSS-Bridge/rss-bridge)
* [rss-guard](https://github.com/martinrotter/rssguard)
* [RSSHub](https://github.com/DIYgod/RSSHub) 

## License

This project uses the following license: [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
