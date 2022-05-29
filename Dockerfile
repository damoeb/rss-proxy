# the image
FROM damoeb/rich-rss:core-2

RUN echo 'you are here' && pwd && ls -lah
COPY packages/playground/dist/ ./static

ENV spring_profiles_active=stateless
