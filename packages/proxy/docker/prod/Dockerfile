# the build
FROM node:12-stretch-slim
WORKDIR /opt/rss-proxy-build

RUN apt-get update \
  && apt-get install -y git

COPY [ "package.json", "package-lock.json", "core/rss-proxy-core-0.0.0.tgz", "entrypoint.sh", "proxy", "./" ]

RUN npm install rss-proxy-core-0.0.0.tgz --ignore-scripts \
  && yarn install --production --ignore-scripts \
  && rm rss-proxy-core-0.0.0.tgz

# the image
FROM node:12-stretch-slim
WORKDIR /opt/rss-proxy

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && chown -R 0444 .

COPY --from=0 /opt/rss-proxy-build/ ./

USER node

ENTRYPOINT [ "sh", "entrypoint.sh" ]

EXPOSE 3000
