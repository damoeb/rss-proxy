#!/usr/bin/env bash

clean () {
  cd ../core && npm run clean && cd -
  cd ../playeground && npm run clean && cd -
  npm run clean
}

build_core () {
  # build core
  echo "\n core"
  cd ../core && npm run build && npm pack && cd -

  # copy core
  mkdir -p ./dist/@rss-proxy/core
  cp -r ../core/rss-proxy-core-0.0.0.tgz ./dist/@rss-proxy/core
}

build_proxy () {
  echo "\n proxy"
  npm run build:proxy
  cp src/build.json dist/@rss-proxy/proxy
}

build_playground () {
  echo "\n playground"
  cd ../playground && npm run build -- --prod && cd -

  # copy:playground
  mkdir -p dist/@rss-proxy/proxy/static
  cp -r ../playground/dist/@rss-proxy/playground/* dist/@rss-proxy/proxy/static
}

docker_image () {
  echo "\n docker"
  pwd
  cp docker/prod/* package.json package-lock.json dist/@rss-proxy/
  cd dist/@rss-proxy && docker build -t damoeb/rss-proxy -f Dockerfile .
}


clean
build_core
build_proxy
build_playground
docker_image
