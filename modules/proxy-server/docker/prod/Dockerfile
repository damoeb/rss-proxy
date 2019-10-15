# -- Test

FROM python:slim
COPY nginx.conf .
RUN pip -q install gixy && gixy nginx.conf

# -- Build

FROM node:10-stretch
WORKDIR /opt/kontor

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4 \
  && echo "deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/4.0 main" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list \
  && apt-get update \
  && apt-get install --no-install-recommends -y mongodb-org nginx \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && rm -rf /data/db \
  && mkdir -p /data/db

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY [ "entrypoint.sh", ".build-cache/package.json", "./" ]

RUN yarn install --production

COPY .build-cache/* ./

RUN chown -R 0444 .

USER node

ENTRYPOINT [ "sh", "entrypoint.sh" ]

EXPOSE 8080
EXPOSE 433
