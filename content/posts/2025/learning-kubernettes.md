+++
title = "Learning Kubernetes: A Beginner's Journey"
date = "2025-05-12T20:00:00Z"
year = "2025"
month= "2025-05"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "https://www.funkysi1701.com/cdn-cgi/image/width=800,quality=75/images/kubernetes.png"
images =['https://www.funkysi1701.com/cdn-cgi/image/width=800,quality=75/images/kubernetes.png']
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
I know nothing (or very little) about kubernetes. It is high time I do something to learn more about it.

## What is Kubernetes?

Kubernetes is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. If you want to run your containerized applications, you probably want to learn kubernetes.

I have worked at least two companies so far in my career that have made use of kubernetes to run their microservice architecture. Let's take a look at how to use it.

## Docker Desktop

[Docker Desktop](https://www.docker.com/products/docker-desktop/) is a tool for running containers, but it also allows running of kubernetes.

I am not going to talk through installing docker desktop and getting a kubernetes cluster set up, for that check out the [documentation](https://docs.docker.com/desktop/features/kubernetes/) however I found it very straightforward.

## kubectl

kubectl is the command line tool for doing everything with kubernetes.

```powershell
kubectl version
```

This prints out basic version information, if this works you know kubernetes must be working.

```powershell
kubectl config get-contexts
kubectl config use-context docker-desktop
```

This command allows you to switch contexts, to use with docker desktop you want to use the docker-desktop context. At work we have dev and test contexts that can be selected in a similar way.

```powershell
kubectl get all
```

This gives you a list of everything that is running in the default namespace, pods, services, deployments etc For a complete list, you can add the --all-namespaces flag.

## Hello World

Now what is the equivalent of "Hello World" for kubernetes? I think getting a container to run in kubernetes is a pretty good test.

Open up VS Code and create a yaml file called grafana.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: grafana
spec:
  containers:
  - name: grafana
    image: grafana/grafana:12.0.0
    ports:
        - containerPort: 3000
```

This file uses the grafana container image, which I am familiar with (see [my previous blog posts](/posts/2025/setting-up-grafana/)) It's default port is 3000 which you can see is defined in this file. 

```powershell
kubectl apply -f grafana.yaml
```

This deploys a pod, using the above yaml file.

You can run the following to find out more about the pod.

```powershell
kubectl describe pod grafana
```

From what I have discovered so far, kubernetes runs in its own network. So going to localhost:3000 won't work. But you can use port forward to get round this issue.

```powershell
kubectl port-forward pod/grafana 3000:3000
```

Now if I try http://localhost:3000/login I see the login page for the grafana container. A pretty good first test of using kubernetes.

## Whats next?

I want to replace my local deployment of containers that is currently using a docker compose file with kubernetes. I also want to learn more about [Helm charts](https://helm.sh/) as I believe this will help