FROM damoeb/feedless:core-0
ARG PROXY_VERSION
ENV spring_profiles_active=stateless \
    OTHER_VERSIONS="RSSproxy v${PROXY_VERSION} https://github.com/damoeb/rss-proxy"

COPY packages/playground/dist/ ./static
