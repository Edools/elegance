FROM node:12.19.1-stretch

# install ruby to run entrypoint script
RUN apt-get update -yqq \
  && apt-get install -yqq --no-install-recommends \
    git \
    ca-certificates \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
  && truncate -s 0 /var/log/*log

WORKDIR /app
COPY bower.json package.json package-lock.json /app/

# Allow bower install with root
RUN npm install -g bower
RUN npm install -g @herospark/hero-themes-cli

# Install Dependencies
RUN npm install
RUN bower install
