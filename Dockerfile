# Use a Node.js base image with the desired version
FROM node:18.12.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install project dependencies
RUN yarn install

# Copy the rest of the project files
COPY . .

# Set the entry point to run the `yarn scrape` script
CMD ["yarn", "scrape"]
