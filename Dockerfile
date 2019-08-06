FROM node:lts-alpine
RUN apk add --no-cache firefox-esr xvfb
WORKDIR /repo
COPY . .
RUN yarn config set cache-folder /tmp/cache/yarn
RUN yarn install --pure-lockfile && rm -rf node_modules packages/*/node_modules
ENTRYPOINT ["/src/support/xvfb_entrypoint.sh"]
CMD /bin/sh