+++
title = "Deploying My Blog to Kubernetes with Helm Charts"
date = "2025-05-26T20:00:00Z"
year = "2025"
month = "2025-05"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "https://www.funkysi1701.com/cdn-cgi/image/width=800,quality=75/images/helm-hugo.png"
images = ["https://www.funkysi1701.com/cdn-cgi/image/width=800,quality=75/images/helm-hugo.png"]
tags = ["Kubernetes", "Helm", "DevOps", "Hugo", "Blog", "Deployment"]
category = "tech"
description = "Learn how to deploy a Hugo blog to Kubernetes using Helm charts for easy, repeatable, and configurable deployments."
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

Deploying static sites like this blog to Kubernetes can be made much easier and more maintainable using Helm charts. Helm allows you to package your Kubernetes resources, manage configuration, and deploy updates with a single command.

In this post, I’ll walk through how I created a Helm chart to deploy this blog, making it easy to spin up new environments or update my site with minimal effort. Currently this blog runs on an Azure static web apps, with my kubernetes cluster used for development and learning, however the principles applied here could be applied to a blog running in production.

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
  repository: mydockerhubusername/hugo-blog
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: NodePort
  port: 80
  nodePort: 30081
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

This all assumes that I have a container image of my hugo blog. Creating this was half the work.

I had been using a docker compose file to build my blog, however this doesn't copy my files into the container it creates a volume so share my files with the container. I needed a Dockerfile that would copy my source code into a container and then save into a container registry.

This is the Dockerfile I created, as you can see it is a two stage build. First it takes the hugo base image, copies my files into it and builds Hugo. Then the nginx web server is run and the default web port 80 is exposed.

```Dockerfile
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
```

## Benefits

- **Repeatable Deployments:** Easily spin up new environments.
- **Configuration Management:** Override values for different clusters or environments.
- **Easy Updates:** Upgrade with a single command.

## Conclusion

If you’re deploying to Kubernetes, I highly recommend giving Helm Charts a try!

Have you used Helm for static sites or blogs? Share your experience in the comments below!
