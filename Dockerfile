
FROM node:8.11.1-alpine

ARG SERVERLESS_VERSION=1.26.1
ARG APP_ENV
ENV APP_ENV=$APP_ENV

WORKDIR /src

RUN apk --no-cache update && \
    apk --no-cache add python py-pip py-setuptools ca-certificates curl groff less && \
    pip --no-cache-dir install awscli && \
    rm -rf /var/cache/apk/*

RUN yarn global add serverless@$SERVERLESS_VERSION

COPY package.json yarn.lock /src/

RUN yarn install --ignore-scripts --non-interactive

ADD . /src

RUN echo "Environment $APP_ENV"

CMD yarn offline $APP_ENV
