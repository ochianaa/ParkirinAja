FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy the package.json file to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Command to run the app using nodemon for development
CMD ["npm", "run", "dev"]