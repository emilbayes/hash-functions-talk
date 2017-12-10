#!/usr/bin/env bash

# Download a version of the Node.js source code
curl -O https://nodejs.org/dist/latest/node-v9.2.0.tar.xz

# Then check the downloaded file with the committed shasum. This is also what
# you would do for eg. a docker container, where the shasum is kept in git
# and you download the binary or source code as part of the build process.
# The shasum file can be retrived from the Node.js distribution repository
# (the same URL as above), but you will want to do this once, when you audit the
# node.js build, and then check it into git
sha256sum -c SHASUMS256.txt
