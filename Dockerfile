FROM node:8.16.2-jessie

# install ruby to run entrypoint script
RUN apt-get update -yqq \
  && apt-get install -yqq --no-install-recommends ruby \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
  && truncate -s 0 /var/log/*log

WORKDIR /app
COPY ./bower.json /app/

# Allow bower install with root
RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN npm install -g bower
RUN npm install -g --unsafe-perm=true --allow-root edools-theme-cli

# Install Dependencies
RUN npm install
RUN bower install
