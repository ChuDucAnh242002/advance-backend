# lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json before copying the rest
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the app files
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Define the command to start the application
CMD ["node", "index.js"]

