# Use an official Node runtime as a parent image
FROM node:16.3.0-alpine3.13 as build

# Add the frontend directory to make absolute filepaths consistent across services
WORKDIR /app/frontend

# Install Node dependencies
COPY package.json /app/frontend
RUN npm install --legacy-peer-deps

# Add the rest of the code, noting that node_modules is excluded by .dockerignore
COPY . /app/frontend

RUN npm run build 

# Make port 3000 available for the app

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/frontend/build /usr/share/nginx/html
# new
COPY --from=build /app/frontend/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

