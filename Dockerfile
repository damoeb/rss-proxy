FROM damoeb/feedless:core-0.1.1
ENV APP_AUTHENTICATION=root \
    APP_JWT_SECRET=password \
    APP_HOST_URL=http://localhost:8080 \
    APP_ACTUATOR_PASSWORD=password \
    APP_TIMEZONE=Europe/Berlin \
    APP_LOG_LEVEL=error \
    APP_ACTIVE_PROFILES="legacy,cache,static" \
    APP_WHITELISTED_HOSTS="" \
    AUTH_TOKEN_ANONYMOUS_VALIDFORDAYS=3 \
    APP_ROOT_EMAIL=admin@localhost \
    APP_ROOT_SECRET_KEY=password
COPY packages/playground/dist/ ./public
