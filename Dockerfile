FROM node:lts-alpine as builder
WORKDIR /tmp/dependencies
COPY . .
RUN yarn install --cache-folder /tmp/cache/yarn

FROM node:lts-alpine
RUN apk add --no-cache firefox-esr xvfb
COPY --from=builder /tmp/cache/yarn /tmp/cache/yarn
RUN yarn config set cache-folder /tmp/cache/yarn
ENTRYPOINT ["/src/support/xvfb_entrypoint.sh"]