# Build stage
FROM floryn90/hugo:ubuntu AS builder

RUN apt-get update -y && apt-get install -y git

# Build site
WORKDIR /src
COPY . /src
ARG HUGO_BASEURL=/
ENV HUGO_BASEURL=${HUGO_BASEURL}
RUN hugo version
RUN cd /src/exampleSite && hugo --themesDir=../../ --theme=src -b ${HUGO_BASEURL}

# Final stage
FROM nginx:1.28.0
COPY --from=builder /src/exampleSite/public /app
COPY ./docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
RUN useradd -U -u 1000 appuser && \
    chown -R 1000:1000 /app
USER 1000
