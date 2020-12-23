FROM damoeb/rss-proxy
WORKDIR /opt/rss-proxy

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
USER root
RUN apt-get update \
  && apt-get install -y ca-certificates\
                 fonts-liberation\
                 libappindicator3-1\
                 libasound2\
                 libatk-bridge2.0-0\
                 libatk1.0-0\
                 libc6\
                 libcairo2\
                 libcups2\
                 libdbus-1-3\
                 libexpat1\
                 libfontconfig1\
                 libgbm1\
                 libgcc1\
                 libglib2.0-0\
                 libgtk-3-0\
                 libnspr4\
                 libnss3\
                 libpango-1.0-0\
                 libpangocairo-1.0-0\
                 libstdc++6\
                 libx11-6\
                 libx11-xcb1\
                 libxcb1\
                 libxcomposite1\
                 libxcursor1\
                 libxdamage1\
                 libxext6\
                 libxfixes3\
                 libxi6\
                 libxrandr2\
                 libxrender1\
                 libxss1\
                 libxtst6\
                 lsb-release\
                 wget\
                 xdg-utils\
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

ENV RP_SUPPORT_JAVASCRIPT=true
RUN chown -R node node_modules/puppeteer && node node_modules/puppeteer/install.js

USER node
#CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]

#EXPOSE 3000
