FROM node:10

ENV NODE_ENV production
ENV PORT 3000
ENV WORKDIR /usr/src/gateway
# Create app directory
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
#For dev
#RUN yarn install
#For production
RUN npm ci --only=${NODE_ENV}
# Bundle app source
COPY . .

RUN chown -R node:node $WORKDIR/

EXPOSE $PORT

USER node

CMD [ "yarn", "start" ]
