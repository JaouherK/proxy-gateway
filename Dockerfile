FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/gateway
WORKDIR /usr/src/gateway

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

RUN chown -R node:node .

EXPOSE 80

USER node

CMD [ "yarn", "start" ]
