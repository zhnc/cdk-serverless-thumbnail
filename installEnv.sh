#!/usr/bin/env bash

yum install git docker -y
systemctl start docker

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

npm config set registry http://r.cnpmjs.org

cat << EOF > /etc/docker/daemon.json
{
    "registry-mirrors": ["http://registry.docker-cn.com"]
}
EOF

cat << EOF >> /etc/hosts
192.30.253.112     github.com
151.101.72.133    assets-cdn.github.com
151.101.193.194    github.global.ssl.fastly.net
EOF

npm install -g aws-cdk
aws configure
