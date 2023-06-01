# Use the official Node.js v18 base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the built project to the container
COPY ./dist ./

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD [ "node", "./www" ]
