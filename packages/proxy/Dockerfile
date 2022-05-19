# the image
FROM damoeb:rich-rss-0.1
WORKDIR /opt/rss-proxy

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

COPY --from=0 /opt/rss-proxy-build/ ./

ENV spring_profiles_active=stateless

EXPOSE 3000
