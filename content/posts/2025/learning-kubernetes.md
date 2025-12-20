+++
title = "Learning Kubernetes: A Beginner's Journey"
date = "2025-05-12T20:00:00Z"
year = "2025"
month= "2025-05"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/kubernetes.png"
images =['/images/kubernetes.png']
tags = ["Kubernetes", "Docker", "Grafana", "Container Orchestration", "DevOps", "Microservices"]
category="tech"
description = "A beginner's journey into Kubernetes: Learn how to deploy containers, use kubectl, and run a Grafana pod with simple YAML configurations."
showFullContent = false
readingTime = true
copyright = false
featured = true
draft = false
aliases = [
    "/learning-kubernetes",
    "/posts/learning-kubernetes",
    "/posts/2025/05/12/learning-kubernetes",
    "/2025/05/12/learning-kubernetes" 
]
+++
I know nothing (or very little) about Kubernetes. It is high time I do something to learn more about it. Kubernetes is a powerful tool for managing containerized applications, and it's becoming a must-have skill for developers and DevOps engineers. In this blog, I'll share my journey as a beginner exploring Kubernetes, from running a simple Grafana pod to understanding the basics of `kubectl`. Let's dive in!

## What is Kubernetes?

Kubernetes is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. If you want to run your containerized applications, you probably want to learn Kubernetes.

I have worked at least two companies so far in my career that have made use of Kubernetes to run their microservice architecture. Let's take a look at how to use it.

### Why Learn Kubernetes?

Kubernetes is widely used in modern software development for:

- **Microservices**: Manage and scale multiple services independently.
- **CI/CD Pipelines**: Automate deployments and rollbacks.
- **Scalability**: Handle traffic spikes by scaling pods up or down.

## Docker Desktop

[Docker Desktop](https://www.docker.com/products/docker-desktop/) is a tool for running containers, but it also allows running of Kubernetes.

I am not going to talk through installing docker desktop and getting a Kubernetes cluster set up, for that check out the [documentation](https://docs.docker.com/desktop/features/kubernetes/) however I found it very straightforward.

## kubectl

kubectl is the command line tool for doing everything with Kubernetes.

```powershell
kubectl version
```

This prints out basic version information, if this works you know Kubernetes must be working.

```powershell
kubectl config get-contexts
kubectl config use-context docker-desktop
```

This command allows you to switch contexts, to use with docker desktop you want to use the docker-desktop context. At work we have dev and test contexts that can be selected in a similar way.

- **Context**: A Kubernetes context is a set of access parameters for a cluster. It allows you to switch between different clusters or environments (e.g., dev, test, production).

```powershell
kubectl get all
```

This gives you a list of everything that is running in the default namespace, pods, services, deployments etc For a complete list, you can add the --all-namespaces flag.

- **Namespace**: A namespace is a way to organize resources in a Kubernetes cluster, providing isolation between different projects or teams.

## Hello World

Now what is the equivalent of "Hello World" for Kubernetes? I think getting a container to run in Kubernetes is a pretty good test.

Open up VS Code and create a yaml file called grafana.yaml

```yaml
apiVersion: v1 # Specifies the API version for the resource
kind: Pod # Defines the resource type as a Pod
metadata:
  name: grafana # The name of the pod
spec:
  containers:
  - name: grafana # The name of the container
    image: grafana/grafana:12.0.0 # The container image to use
    ports:
        - containerPort: 3000 # The port exposed by the container
```

This file uses the Grafana container image, which I am familiar with (see [my previous blog posts](/posts/2025/setting-up-grafana/)) It's default port is 3000 which you can see is defined in this file.

```powershell
kubectl apply -f grafana.yaml
```

This deploys a pod, using the above yaml file.

You can run the following to find out more about the pod.

```powershell
kubectl describe pod grafana
```

From what I have discovered so far, Kubernetes runs in its own network. So going to localhost:3000 won't work. But you can use port forward to get round this issue.

- **Port-Forwarding**: This allows you to access a pod's service on your local machine by forwarding a port from the pod to your localhost.

```powershell
kubectl port-forward pod/grafana 3000:3000
```

Now if I try http://localhost:3000/login I see the login page for the Grafana container. A pretty good first test of using Kubernetes.

## Whats next?

I want to replace my local deployment of containers that is currently using a docker compose file with Kubernetes. I also want to learn more about [Helm charts](https://helm.sh/) as I believe these are an excellent way of packaging up changes to Kubernetes.


## Related Posts

- [Setting Up Grafana for Monitoring .NET Apps with Docker](/posts/2025/setting-up-grafana) — Monitoring, Docker, DevOps
- [Integrating OpenTelemetry Logs with Grafana Using Loki and Alloy](/posts/2025/opentelemetry-logs) — Logging, Monitoring, DotNet
- [Periodic Table of DevOps 2025](/posts/2025/periodic-table-devops-2025) — DevOps, tools, trends
- [Simplifying Dependency Management with NuGet Central Package Management](/posts/2025/nuget-central-package-management) — NuGet, DevOps

Have you tried running a pod in Kubernetes? What challenges did you face, and how did you overcome them? Share your thoughts in the comments below!
