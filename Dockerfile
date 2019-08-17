FROM node:10

WORKDIR /usr/src/app
ADD . ./
RUN yarn install

ENV NODE_ENV=production

EXPOSE 4000
CMD ["yarn", "start"]
