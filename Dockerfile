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
RUN echo '{ "allow_root": true }' > /root/.bowerrc;

# Install Dependencies
RUN npm install -g @herospark/hero-themes-cli 
RUN npm install @babel/core @babel/plugin-transform-runtime @babel/preset-env @babel/runtime
RUN bower install
RUN npm install
