FROM node:10-stretch
WORKDIR /opt/rssproxy/

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN apt-get update \
  && apt-get upgrade -y \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && rm -rf /data/db \
  && mkdir -p /opt/rssproxy/sources

COPY entrypoint.sh ./

ENTRYPOINT [ "sh", "entrypoint.sh" ]

#USER node

EXPOSE 3000

# todo CTRL+C should kill the docker process
