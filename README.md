# RSS-proxy

RSS-proxy is a tool that allows you to do create an RSS/ATOM or JSON feed of almost any website, 
purely by analyzing just the static HTML structure.

![Playground](https://gitlab.com/damoeb/rss-proxy/-/raw/master/docs/rssproxy-candidates.png "Plauground")

## Running RSS-proxy using docker

The simplest way to use RSS-proxy is using [docker](https://docs.docker.com/install/)

```
 docker run -p 3000:3000 -it damoeb/rss-proxy
```
Then open [localhost:3000](http://localhost:3000) in the browser.

## Running RSS-proxy from source

For local development you need [node 12+](https://nodejs.org/en/). Then follow these steps:

- Install all npm dependencies
```
npm run bootstrap

```

- Start server
```
cd packages/proxy && npm run start

```

- Start client
```
cd packages/playground && npm run start

```

## Developing RSS-proxy

The project is separated into three modules
- [core](packages/core/README.md): the feed parser logic, plain JavaScript
- [playground](packages/playground/README.md): the web app to visualize and explore feed generation
- [proxy](packages/proxy/README.md): the expressjs server


## Contributors

* [damoeb](https://github.com/damoeb)  🐛

## License

This project uses the following license: [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
