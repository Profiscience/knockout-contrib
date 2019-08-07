FROM node:lts-alpine
RUN apk add --no-cache firefox-esr git xvfb
WORKDIR /repo
COPY . .
RUN yarn install --pure-lockfile && rm -rf node_modules packages/*/node_modules
ENTRYPOINT ["/repo/support/xvfb_entrypoint.sh"]
CMD /bin/sh