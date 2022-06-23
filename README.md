# RSS-proxy

RSS-proxy allows you to do create an RSS/ATOM or JSON feed of almost any website or feed, 
purely by analyzing just the HTML structure. Try the [live demo](https://rssproxy.migor.org/).
The server is completely stateless, everything is part of the url.

It is a UI for [richRSS](https://github.com/damoeb/rich-rss) middleware and is shipped in a multiplatform docker image.

![Playground](https://github.com/damoeb/rss-proxy/raw/master/docs/rssproxy-candidates.png "Playground")

## Quickstart using docker-compose

The simplest way to use RSS-proxy is using [docker](https://docs.docker.com/install/) or [podman](https://podman.io/getting-started/installation).
This will start rss-proxy and puppeteer

```
wget https://raw.githubusercontent.com/damoeb/rss-proxy/master/docker-compose.yml
docker-compose up
```

This will start `rss-proxy` and a headless chrome. Open [localhost:8080](http://localhost:8080) in the browser.

## Features
- Web to Feed
- Dynamic rendering using headless chromium
- Feed Format Conversion
- Content Recovery using [JSON-LD](http://json-ld.org/), [OpenGraph](https://ogp.me/) and fulltext extraction
- Filters
- Security
- Alerts if the feed transformation encounters problems
- Privacy


## Minimal Runtime
If you consider using `rss-proxy` just for static websites, do this:

```
docker pull damoeb/rss-proxy:2
docker run -e APP_PUBLIC_URL=http://localhost:8080 -e TOKEN_SECRET=1234_top_secret -p 8080:8080 -it damoeb/rss-proxy:2
```

## Security
Every API access requires a signed token. Requests are throttled on IP level and token level.


## Flags


| Name            | Description      |       |
|-----------------|------------------|-------|
| PUPPETEER_HOST  |                  | -     |
| LOG_LEVEL       |                  | error |
| ENABLE_FULLTEXT |                  | true  |
| TOKEN_SECRET    | To sign the JWTs | -     |


## Security


## Changelog

See [changelog](changelog.md).


## Related Projects

* [rss-bridge](https://github.com/RSS-Bridge/rss-bridge)
* [rss-guard](https://github.com/martinrotter/rssguard)
* [RSSHub](https://github.com/DIYgod/RSSHub) 

## License

This project uses the following license: [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
