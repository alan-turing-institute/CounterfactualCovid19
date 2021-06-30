# Use an official Node runtime as a parent image
FROM node:16.3.0-alpine3.13

# Add the frontend directory to make absolute filepaths consistent across services
WORKDIR /app/frontend

# Install Node dependencies
COPY package.json /app/frontend
RUN npm install --legacy-peer-deps

# Add the rest of the code, noting that node_modules is excluded by .dockerignore
COPY . /app/frontend

RUN npm run build 
RUN npm install -g serve

# Make port 3000 available for the app
EXPOSE 3000

# Entrypoint
CMD ["serve", "-s", "build", "-l", "3000"]
