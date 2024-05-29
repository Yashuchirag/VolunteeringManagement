FROM node:20-alpine as build

WORKDIR /app

COPY package*.json /app

RUN npm install
RUN npm install react-scripts --save-dev

COPY . /app

RUN npm run build

# Using Nginx as the web server
FROM nginx:alpine

# Copying the build output from the previous stage to the NGINX web server directory
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

# Starting NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]

