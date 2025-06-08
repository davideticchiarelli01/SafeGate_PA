# Use the official Node.js 18 image based on Alpine for a lightweight container
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json and tsconfig.json to install dependencies and configure TypeScript
COPY package*.json tsconfig.json ./

# Install project dependencies using npm
RUN npm install

# Copy all project files into the container's working directory
COPY . .

# Compile TypeScript project 
RUN npm run build

# Expose port 3000 to allow external access to the application
EXPOSE 3000

# Define the default command to run the application
CMD ["npm", "start"]
