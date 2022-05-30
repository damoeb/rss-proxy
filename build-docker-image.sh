#!/usr/bin/env bash

OLDPWD=`pwd`

clean () {
  cd packages/playground && yarn clean
  cd $OLDPWD
}

build_playground () {
  echo "\n playground"
  cd packages/playground && yarn build:prod
  cd $OLDPWD
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
  docker build -t damoeb/rss-proxy -f Dockerfile .
  echo 'docker images done'
}


clean
build_playground
docker_image
