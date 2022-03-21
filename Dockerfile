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

RUN npm install -g bower
RUN npm install -g @herospark/hero-themes-cli 
RUN npm install --allow-root @babel/core @babel/plugin-transform-runtime @babel/preset-env @babel/runtime

# Install Dependencies
RUN npm install --allow-root
RUN bower install --allow-root
