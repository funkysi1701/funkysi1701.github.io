# Use Hugo to build the site at runtime, allowing BASEURL to be set via environment variable

FROM floryn90/hugo:0.119.0

WORKDIR /site

# Copy site source files
COPY . /site

# Expose port
EXPOSE 1313

# Set default base URL (can be overridden at runtime)
ENV HUGO_BASEURL="http://localhost"

# Build and serve the site at container startup
ENTRYPOINT []
CMD hugo server --minify --buildFuture --baseURL "$HUGO_BASEURL" --bind 0.0.0.0 --port 1313