#!/usr/bin/env bash

yum install git docker -y
systemctl start docker

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

npm install -g aws-cdk
aws configure
