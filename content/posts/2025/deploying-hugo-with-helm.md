+++
title = "Deploying My Blog to Kubernetes with Helm Charts"
date = "2025-05-26T20:00:00Z"
year = "2025"
month = "2025-05"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/helm-hugo.png"
images = ["/images/helm-hugo.png"]
tags = ["Kubernetes", "Helm", "DevOps", "Hugo", "Blog", "Deployment"]
category = "tech"
description = "By reading this post, you'll learn how to deploy a Hugo blog to Kubernetes using Helm charts, making your deployments easy, repeatable, and configurable."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/deploying-hugo-with-helm",
    "/posts/deploying-hugo-with-helm",
    "/posts/2025/05/26/deploying-hugo-with-helm",
    "/2025/05/26/deploying-hugo-with-helm"
]
+++

Helm allows you to package your Kubernetes resources, manage configuration, and deploy updates with a single command.

In this post, I’ll share how I used Helm to deploy my Hugo blog, making it easy to manage updates and spin up new environments. Full disclosure: My blog currently runs on an Azure Static Web App, but now that I know how to deploy to a Kubernetes cluster, I have the option to switch if needed.

## Why Use Helm?

Helm is the package manager for Kubernetes. It lets you:

- **Template** your Kubernetes YAML files for reuse and configuration.
- **Version** your deployments for easy rollbacks.
- **Share** your charts with others or use community charts.

## Creating a Helm Chart for Hugo

First, I scaffolded a new Helm chart:

```sh
helm create hugo-blog
```

This creates a directory structure with templates for deployments, services, and ingress.

### Customizing the Chart

I edited `values.yaml` to set my image and service details:

```yaml
image:
  repository: mydockerhubusername/hugo-blog # Docker image repository
  tag: latest # Use the latest tag for the image
  pullPolicy: IfNotPresent # Pull the image only if it’s not already present

service:
  type: NodePort # Expose the service on a specific port
  port: 80 # Internal port for the service
  nodePort: 30081 # External port for accessing the service
```

### Deploying the Blog

To deploy the blog, I ran:

```sh
helm install my-hugo-blog ./hugo-blog
```

Helm rendered the templates and created the necessary Kubernetes resources.

### Updating the Blog

When I rebuild and push a new Docker image, I can upgrade my deployment with:

```sh
helm upgrade my-hugo-blog ./hugo-blog
```

This triggers a rolling update in Kubernetes.

### Creating a Docker Image of my Blog

This all assumes that I have a container image of my Hugo blog. Creating this was half the work.

I had been using a docker-compose file to build my blog; however, this doesn't copy my files into the container it creates a volume to share my files with the container. I needed a Dockerfile that would copy my source code into a container and then save it into a container registry.

This is the Dockerfile I created. As you can see, it is a two-stage build. First, it takes the Hugo base image, copies my files into it, and builds Hugo. Then the NGINX web server is run, and the default web port 80 is exposed.

```Dockerfile
# Step 1: Build the Hugo site
FROM floryn90/hugo:0.119.0 AS builder

# Set working directory inside the container
WORKDIR /src

# Copy site files to the container
COPY . .

# Build the Hugo site
RUN hugo --minify --config config.toml

# Step 2: Serve with nginx
FROM nginx:alpine

# Remove the default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the generated site from the builder stage
COPY --from=builder /src/public /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

## Benefits

- **Repeatable Deployments:** Easily spin up new environments.
- **Configuration Management:** Override values for different clusters or environments.
- **Easy Updates:** Upgrade with a single command.

## Conclusion

Helm charts have made deploying my Hugo blog to Kubernetes a seamless and efficient process. With features like templating, versioning, and easy updates, Helm is a must-have tool for Kubernetes deployments.

If you’re managing static sites or microservices, give Helm a try and see how it can simplify your workflow!

Have you used Helm for static sites or blogs? Share your experience in the comments below!
