# RSS-proxy

RSS-proxy is a tool that allows you to do create an RSS/ATOM or JSON feed of almost any website, 
purely by analyzing just the static HTML structure. Try the [live demo](https://rssproxy.migor.org/).

![Playground](https://github.com/damoeb/rss-proxy/raw/master/docs/rssproxy-candidates.png "Playground")

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

## Developing RSS-proxy

The project is separated into three modules
- [core](packages/core/README.md): the feed parser logic, plain JavaScript
- [playground](packages/playground/README.md): the web app to visualize and explore feed generation
- [proxy](packages/proxy/README.md): the expressjs server


## Changelog

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

## Roadmap
See [Roadmap](https://github.com/damoeb/rss-proxy/blob/master/roadmap.md).

## Contributors

* [damoeb](https://github.com/damoeb)

## Contact

* https://twitter.com/damoeb

## License

This project uses the following license: [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
