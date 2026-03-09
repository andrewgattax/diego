# Stage 1: Build the application
FROM node:20-alpine AS build
WORKDIR /app

# Copy configuration and install dependencies first for caching purposes
COPY package.json package-lock.json ./
RUN npm install

# Copy all source files and build
COPY . .
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine AS production

# Copy the generated build output from the first stage to Nginx's path
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 and start Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
