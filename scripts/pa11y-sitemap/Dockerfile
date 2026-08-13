# Prebaked Pa11y runner: Node 20 + Chromium + npm deps.
# Built on GitHub-hosted runners and pushed to GHCR so ARC nightly jobs avoid cold Docker Hub pulls.
FROM node:20-bookworm

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_SKIP_DOWNLOAD=true \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    PA11Y_CONFIG=/config/pa11y.json

RUN apt-get update -qq \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --no-install-recommends \
    chromium \
    ca-certificates \
    fonts-liberation \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/pa11y-runner

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Baked copy for a runnable image; nightly bind-mounts the workspace scan.mjs over this path
# so scanner logic can ship without waiting for an image rebuild.
COPY scan.mjs ./

# Config: mount scripts/pa11y-pipeline.json at /config/pa11y.json (see pa11y-nightly.yml).
ENTRYPOINT ["node", "scan.mjs"]
