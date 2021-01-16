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

verify_image () {
  printf "Fine? (Y/n): "
  read yn

  if [ "${yn}" == "n" ] && [ "${yn}" != "" ]; then
    echo 'Aborting...'
    exit 1
  fi
}

docker_image () {
  echo "docker..."

  printf "Enter new version: "
  read tag

  if [ "${tag}" == "" ]; then
    echo 'Please enter a valid version'
    exit 1
  fi

  echo -e "Using version '${tag}'"
  pwd
  cp docker/prod/* package.json package-lock.json dist/@rss-proxy/
  cd dist/@rss-proxy && docker build -t damoeb/rss-proxy -f Dockerfile . && cd -
  cd docker/prod/puppeteer && docker build -t damoeb/rss-proxy:js -f Dockerfile .
  echo 'docker images done'
  echo ''
  echo 'Verify LIGHT version (CTRL-C to exit)'
  docker run -p 4200:3000 -it damoeb/rss-proxy
  verify_image

  echo 'Verify JS version (CTRL-C to exit)'
  docker run -p 4200:3000 -it damoeb/rss-proxy:js
  verify_image

  echo "tagging images with ${tag}"
  docker tag damoeb/rss-proxy damoeb/rss-proxy:${tag}
  docker tag damoeb/rss-proxy damoeb/rss-proxy:js-${tag}
  echo "pushing images"
  docker push damoeb/rss-proxy:latest
  docker push damoeb/rss-proxy:${tag}
  docker push damoeb/rss-proxy:js
  docker push damoeb/rss-proxy:js-${tag}
}


clean
build_core
build_proxy
build_playground
docker_image
