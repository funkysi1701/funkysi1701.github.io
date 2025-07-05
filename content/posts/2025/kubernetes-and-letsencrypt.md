+++
title = "Automating SSL for Kubernetes with Let's Encrypt and Cert Manager"
date = "2025-07-07T20:00:00Z"
year = "2025"
month = "2025-07"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/cert-manager.png"
images = ["/images/cert-manager.png"]
tags = ["Kubernetes", "LetsEncrypt", "SSL", "Cert Manager", "Helm", "Cloudflare", "DevOps", "Security", "Automation"]
category = "tech"
description = "How to automate SSL certificates for Kubernetes services using Let's Encrypt, Cert Manager, Helm, and Cloudflare for secure, hassle-free deployments."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/kubernetes-and-letsencrypt",
    "/posts/kubernetes-and-letsencrypt",
    "/posts/2025/07/07/kubernetes-and-letsencrypt",
    "/2025/07/07/kubernetes-and-letsencrypt"
]
+++

I have blogged before about how cool [Let's Encrypt](/posts/2018/lets-encrypt-is-awesome/) is for getting your web things running under https. However I have just got myself a local kubernetes cluster and it is super easy to spin up new web services with SSL certs.

The basic instructions can be found [here](https://www.slingacademy.com/article/how-to-set-up-ssl-with-lets-encrypt-in-kubernetes/) but let's look at what was involved.

First of all lets get Cert Manager installed on kubernetes.

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.18.1/cert-manager.yaml
```

Once the cert manager pods are up, you need to create an issuer which communicates with the lets encrypt API. The first code snippet uses the lets encrypt staging environment to avoid any API limits, the second uses production and uses the cloudflare API to authorize SSL requests.

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
    - http01:
        ingress:
          ingressClassName: nginx
```

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - dns01:
          cloudflare:
            apiTokenSecretRef:
              key: api-key
              name: cloudflare-api-token-secret
            email: your-email@example.com
```

Now that is all configured all I need to do is update my helm chart and any pod I like can have a sub domain of funkysi1701.com with a lets encrypt SSL cert.

This is a section from my helm chart which defines the domain name to use and what issuer to use for the certificate.

```yaml
ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  devHost: helloworld-dev.funkysi1701.com
  testHost: helloworld-test.funkysi1701.com
  tls:
    - secretName: helloworld-dev.funkysi1701.com
      hosts:
        - helloworld-dev.funkysi1701.com
    - secretName: helloworld-test.funkysi1701.com
      hosts:
        - helloworld-test.funkysi1701.com
```

All I need to do now is add similar code like this to every helm chart I publish and my pod will request a SSL certificate. The only manual step I have is to set up a DNS record pointing to the IP address of my cluster for any domain I want to use.

## Conclusion

Setting up Let's Encrypt with Kubernetes and Cert Manager has made it incredibly easy to secure my web services with SSL certificates. With just a few YAML configurations and some simple Helm chart updates, I can automatically provision and renew certificates for any subdomain I need. This approach not only saves time but also ensures my services are always protected with up-to-date encryption. If you're running Kubernetes, I highly recommend giving Cert Manager and Let's Encrypt a try for hassle-free SSL management.