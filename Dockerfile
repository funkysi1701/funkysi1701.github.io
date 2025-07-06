# Step 1: Prepare Hugo build environment
FROM floryn90/hugo:0.119.0 AS builder

WORKDIR /src
COPY . .

# Step 2: Serve with nginx, build site at runtime
FROM nginx:alpine

WORKDIR /site

# Install Hugo in the runtime container
RUN apk add --no-cache hugo

# Copy site source files
COPY . /site

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Entrypoint script to build and serve
COPY --from=builder /src /site
COPY --from=builder /usr/local/bin/hugo /usr/local/bin/hugo

ENV HUGO_BASEURL="https://blog.funkysi1701.com"

CMD hugo --minify --config config-dev.toml --buildFuture --baseURL "$HUGO_BASEURL" && \
    cp -r /site/public/* /usr/share/nginx/html/ && \
    exec nginx -g 'daemon off;'