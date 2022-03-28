#!/bin/sh
bower install
npm install

hero theme:use
hero theme:upload
hero theme:serve --env development