FROM node:20.12.0-alpine as build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN [ "npm", "run", "build"]

# production stage
FROM nginx:1.25.4-alpine as production-stage
COPY config/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]