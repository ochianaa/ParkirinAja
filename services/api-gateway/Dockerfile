FROM oven/bun:latest

# Set working directory in the container
WORKDIR /app

# Copy the package.json file to install dependencies
COPY package*.json bun.lock* ./

# Copy the rest of your application code
COPY . .

# Install dependencies and run the app
CMD ["sh", "-c", "bun install && bun run dev"]