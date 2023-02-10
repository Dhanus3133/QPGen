# pull official base image
FROM node:lts-alpine

# set work directory
# WORKDIR /app/

# add to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn
RUN yarn install --frozen-lockfile

# add app
COPY . ./
# RUN chmod -R 777 node_modules
RUN yarn build

# WORKDIR /
