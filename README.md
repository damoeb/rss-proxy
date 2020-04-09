# RSS Proxy

<!--- These are examples. See https://shields.io for others or to customize this set of shields. You might want to include dependencies, project status and licence info here --->
![GitHub repo size](https://img.shields.io/github/repo-size/scottydocs/README-template.md)
![GitHub contributors](https://img.shields.io/github/contributors/scottydocs/README-template.md)
![GitHub stars](https://img.shields.io/github/stars/scottydocs/README-template.md?style=social)
![GitHub forks](https://img.shields.io/github/forks/scottydocs/README-template.md?style=social)
![Twitter Follow](https://img.shields.io/twitter/follow/scottydocs?style=social)

RSS-Proxy is a tool that allows you to do create an RSS/ATOM or JSON feed of almost any website, 
purely by analyzing just the static HTML structure.


## Running RSS-Proxy using docker

The simplest way to use RSS-Proxy is using [docker](https://docs.docker.com/install/)

```
 docker run -p 3000:3000 -it damoeb/rss-proxy
```
Then open [localhost:3000](http://localhost:3000) in the browser.

## Running RSS-Proxy from source

For local development you need [node 12+](https://nodejs.org/en/). THen follow these steps:

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


## Developing RSS-Proxy

The project is separated into three modules
- [core](packages/core/README.md): the feed parser logic, plain JavaScript
- [playground](packages/playground/README.md): the web app to visualize and explore feed generation
- [proxy](packages/proxy/README.md): the server


## Contributors

* [damoeb](https://github.com/damoeb)  🐛

You might want to consider using something like the [All Contributors](https://github.com/all-contributors/all-contributors) specification and its [emoji key](https://allcontributors.org/docs/en/emoji-key).

## Contact

If you want to contact me you can reach me at <your_email@address.com>.

## License

This project uses the following license: [CC-NC](https://en.wikipedia.org/wiki/Creative_Commons_NonCommercial_license).
