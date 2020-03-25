#!/usr/bin/env bash

docker tag rss-proxy-prod:latest damoeb/rss-proxy:latest
docker push damoeb/rss-proxy:latest
