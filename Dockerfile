# Step 1: Build the Hugo site
FROM floryn90/hugo:0.119.0 AS builder

# Set working directory inside the container
WORKDIR /src

# Copy site files to the container
COPY . .

# Build the Hugo site
RUN hugo --minify --config config-dev.toml --buildFuture

# Step 2: Serve with nginx
FROM nginx:alpine

# Remove the default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the generated site from the builder stage
COPY --from=builder /src/public /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]