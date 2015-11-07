FROM ubuntu

MAINTAINER Berry Goudswaard <info@berrygoudswaard.nl>

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libfontconfig \
        libfreetype6 \
        nodejs \
        nodejs-legacy \
        npm \
    && apt-get autoremove -y --purge \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /data
