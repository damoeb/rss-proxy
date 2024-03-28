FROM damoeb/feedless:aio-chromium-0.3
ENV APP_ACTIVE_PROFILES=database,static,selfHosted
COPY docker/feedless/config.json /usr/feedless/public/config.json
