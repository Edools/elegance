FROM node:8.16.2-jessie

# install ruby to run entrypoint script
RUN apt-get update -yqq \
  && apt-get install -yqq --no-install-recommends ruby \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
  && truncate -s 0 /var/log/*log

# Allow bower install with root
RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN npm install -g bower

RUN git config --global user.email "you@example.com"
RUN git config --global user.name "Your Name"

WORKDIR /app
COPY ./bower.json /app/

# Install Dependencies
RUN bower install
RUN npm install -g --unsafe-perm=true --allow-root edools-theme-cli
