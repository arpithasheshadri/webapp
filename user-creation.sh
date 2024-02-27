#!/bin/bash

sudo groupadd -f csye6225
 
# Create user csye6225 and add to group csye6225
sudo useradd -r -s /usr/sbin/nologin -g csye6225 csye6225

sudo chown -R csye6225:csye6225 /opt
pwd
 
sudo cp /tmp/csye6225.service /lib/systemd/system/csye6225.service
 
