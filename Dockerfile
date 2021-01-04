FROM node:12 as vue_builder

RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm install -g npm
RUN npm cache verify
RUN npm install

COPY . .

RUN npm run build

### STAGE 2: Setup ###

FROM nginx:1.13.3-alpine

## Copy our default nginx config
COPY configs/nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=vue_builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
