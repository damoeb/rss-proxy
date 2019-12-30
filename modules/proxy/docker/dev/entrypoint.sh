#!/usr/bin/env bash
mongod --fork --syslog
nginx
cd sources \
  && npm run run:node
