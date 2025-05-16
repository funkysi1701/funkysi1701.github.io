# Use the official Hugo image as the base image
FROM floryn90/hugo:0.119.0

# Set the working directory inside the container
WORKDIR /src

# Copy the entire project into the container
COPY . /src

# Expose the default Hugo server port
EXPOSE 1313

ENV baseURL="http://localhost"
# Run the Hugo server in development mode
CMD ["server", "-D", "--bind", "0.0.0.0", "--disableFastRender", "--buildFuture"]