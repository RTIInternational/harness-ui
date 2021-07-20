FROM node:10-alpine
RUN npm install -g @vue/cli
RUN mkdir /harness-ui
COPY ./ /harness-ui
WORKDIR /harness-ui
RUN yarn install