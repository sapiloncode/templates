# Use an official Node.js runtime as the base image
FROM node:22-alpine

# Install OpenSSL, curl and other necessary packages
RUN apk add --no-cache openssl curl

# Set the working directory in the container
WORKDIR /usr/app

# Copy package.json and package-lock.json (if available)
COPY ./package*.json ./

# Copy Prisma schema before installing dependencies
COPY ./prisma ./prisma

# Install dependencies and clean up dev dependencies
RUN npm ci --only=production --no-audit --no-fund --unsafe-perm

# Copy the source code into the container
COPY ./build ./ 

# Generate Prisma client (binary targets must be in schema.prisma)
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3400

# Define the command to run the app
CMD ["node", "index.js"]