#!/usr/bin/env bash

apt-get update
apt-get install -y curl git

# install docker and docker-compose
curl -sSL https://get.docker.com/ | sh
curl -L https://github.com/docker/compose/releases/download/1.5.1/docker-compose-$(uname -s)-$(uname -m) > /usr/local/bin/docker-compose
chmod u+x /usr/local/bin/docker-compose

# install node
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
apt-get install -y nodejs

# install grunt globally
npm install -g grunt-cli

# set symlink for node_modules to bypass the restriction of path length on windows hosts
mkdir -p /home/vagrant/node_modules/ && chown vagrant:vagrant /home/vagrant/node_modules/
ln -sf /home/vagrant/node_modules/ /vagrant/frontend/node_modules

# run npm & grunt
cd /vagrant/frontend
npm install
grunt

# start docker container
cd /vagrant
docker-compose up -d