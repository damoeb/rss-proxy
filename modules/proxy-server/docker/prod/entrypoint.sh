#!/usr/bin/env bash
mongod --fork --syslog
nginx
node app.js
