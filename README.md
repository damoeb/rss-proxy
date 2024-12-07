# RSS-proxy 

[![Build Status](https://app.travis-ci.com/damoeb/rss-proxy.svg?branch=master)](https://app.travis-ci.com/damoeb/rss-proxy)

RSS-proxy allows you to do create an ATOM or JSON feed of any static website or feeds (web to feed), 
just by analyzing just the HTML structure. [Try the demo](https://rssproxy.migor.org). It is an alternative UI to [feedless](https://github.com/damoeb/feedless) with a reduced feature set.
If you want advanced features like fulltext feeds, aggregation, persistence, authentication and others, checkout [feedless](https://github.com/damoeb/feedless/blob/master/docs/third-party-migration.md)

![Playground](https://github.com/damoeb/rss-proxy/raw/master/docs/rssproxy-candidates.png "Playground")

## Features
- Web to Feed
- Feed to Feed: pipe existing native feeds through `rss-proxy` to filter them
- [Filters](https://github.com/damoeb/feedless/blob/master/docs/filters.md)
- Self Hosting

## Advanced Features
If you look for features below, you have to use [feedless](https://github.com/damoeb/feedless), the successor of `rss-proxy`
- Feed Aggregation
- Authentication and multi-tenancy
- JavaScript Support (prerendering)
- Fulltext Feeds and other content enrichments
- Persistence
- CLI
- GraphQL API
- Plugins

# Changelog
See [here](./changelog.md)

## Quickstart installation using docker
If you have [docker](https://docs.docker.com/install/) or [podman](https://podman.io/getting-started/installation) installed, do this

```
docker pull damoeb/rss-proxy:2.1
docker run -p 8080:8080 -e APP_API_GATEWAY_URL=https://foo.bar -it damoeb/rss-proxy:2.1
```

`APP_API_GATEWAY_URL` is your outfacing url, which will be used as host for feeds you create.

Then open [localhost:8080](http://localhost:8080) in the browser.

## Understanding Docker requirements
For RSS-Proxy to work with your Docker environment, you must ensure :
- that you expose port 8080 on the container
- that the rss-proxy container share a common network with the RSS reader app you are (probably self-hosting). The Docker `bridge` network is native to Docker in order to allow you to connect two containers on the same network.
- then you need to personalize the `APP_API_GATEWAY_URL` : it must point to the IP of rss-proxy on the shared network selected and the container opened port (e.g : 192.172.0.3:8080). If you have a your rss-proxy runs under a named address you can simply point to that named address

## Legacy Version 1
If you are interested in running the first prototype, this is how you do it.

```
docker pull damoeb/rss-proxy:1
docker run -p 3000:3000 -it damoeb/rss-proxy:1
```

Then open [localhost:3000](http://localhost:3000) in the browser.

## License

This project uses the following license: [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
