FROM damoeb/rich-rss:core-0

ENV spring_profiles_active=stateless

COPY packages/playground/dist/ ./static
