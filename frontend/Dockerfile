# Use the official Node.js image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port Vite runs on
EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]