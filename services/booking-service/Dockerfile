FROM oven/bun:latest

# Set working directory in the container
WORKDIR /app

# Copy the package.json file to install dependencies
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy the rest of your application code
COPY . .

# Command to run the app using Bun for development
CMD ["bun", "run", "dev"]