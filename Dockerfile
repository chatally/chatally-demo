# Use the official Node.js image from Docker Hub
FROM node:20

# Copy the app to the container
WORKDIR /usr/src/app
COPY app .

# Install app dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
