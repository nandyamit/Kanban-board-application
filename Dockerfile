FROM node:22.10.0

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install TypeScript and types globally
RUN npm install -g typescript @types/react @types/react-dom

# Install dependencies first
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy the rest of the application
COPY . .

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Create type declaration file
RUN echo "/// <reference types=\"react\" />\n/// <reference types=\"react-dom\" />" > client/src/global.d.ts

# Build the application
RUN cd client && npm run build && cd ../server && npm run build

# Add a script to handle database initialization and seeding
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3001

# Use the entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]