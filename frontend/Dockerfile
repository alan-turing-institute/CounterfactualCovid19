# Use an official Node runtime as a parent image
FROM node:15.5.1-alpine3.12

# Add the frontend directory to make absolute filepaths consistent across services
WORKDIR /app/frontend

# Install Node dependencies
COPY package.json /app/frontend
RUN npm install

# Add the rest of the code
# Note that node_modules is excluded by .dockerignore
RUN ls -alh /app/frontend
COPY . /app/frontend
RUN ls -alh /app/frontend

# Make port 3000 available for the app
EXPOSE 3000


# Entrypoint
CMD ["npm", "start"]