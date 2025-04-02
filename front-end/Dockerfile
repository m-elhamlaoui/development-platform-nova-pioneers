FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all files
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start Vite with explicit host binding
CMD ["npm", "run", "dev", "--", "--host"]
