# RSS-proxy

RSS-proxy is a tool that allows you to do create an RSS/ATOM or JSON feed of almost any website, 
purely by analyzing just the static HTML structure. Try the [live demo](https://rssproxy-v1.migor.org/). 

![Playground](https://github.com/damoeb/rss-proxy/raw/master/docs/rssproxy-candidates.png "Playground")

## Quickstart using docker

The simplest way to use RSS-proxy is using [docker](https://docs.docker.com/install/)

```
docker pull damoeb/rss-proxy
docker run -p 3000:3000 -it damoeb/rss-proxy
```

Then open [localhost:3000](http://localhost:3000) in the browser.

## JavaScript Support
`rss-proxy` supports dynamic webapps in a separate docker image `damoeb/rss-proxy:js` cause it is with 1GB quite large. Running this image will [render a checkbox](https://github.com/damoeb/rss-proxy/blob/master/docs/js-support.png) in the User Interface to pre-render a website in a headless browser, rather than using the static response.

```
docker pull damoeb/rss-proxy:js
docker run -p 3000:3000 -it damoeb/rss-proxy:js
```

## Developing RSS-proxy

The project is separated into three modules
- [core](packages/core/README.md): the feed parser logic, plain JavaScript
- [playground](packages/playground/README.md): the web app to visualize and explore feed generation
- [proxy](packages/proxy/README.md): the expressjs server

For local development you need [node 12+](https://nodejs.org/en/). Then follow these steps:

- Install all npm dependencies
```
npm run install

```

- Start server
```
cd packages/proxy && npm run start

```

- Start client
```
cd packages/playground && npm run start

```


## Troubleshooting

See [troubleshooting](troubleshooting.md).

## Changelog

See [changelog](changelog.md).


## Related Projects

* [rss-bridge](https://github.com/RSS-Bridge/rss-bridge)
* [RSSHub](https://github.com/DIYgod/RSSHub) 

## License

This project uses the following license: [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
