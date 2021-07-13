FROM node:10-alpine
RUN npm install -g @vue/cli
RUN mkdir /datavue-ui
COPY ./ /datavue-ui
WORKDIR /datavue-ui
RUN yarn install