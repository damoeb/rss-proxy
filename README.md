# RSS-proxy

RSS-proxy is a tool that allows you to do create an RSS/ATOM or JSON feed of almost any website, 
purely by analyzing just the static HTML structure. Try the [live demo](https://rssproxy-v1.migor.org/). 
Use the dropdown (see screenshot below of a blog) to choose the feed the suits your needs.

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

## Troubleshooting

See [troubleshooting](troubleshooting.md).

## Changelog

See [changelog](changelog.md).

## Contributors

* [damoeb](https://github.com/damoeb)

## Contact

* https://twitter.com/damoeb

## License

This project uses the following license: [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
