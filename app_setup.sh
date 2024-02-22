#!/bin/bash

sudo cp /tmp/webapp.zip /opt/
cd /opt/ || exit
sudo unzip webapp.zip

cd /opt/webapp/
sudo cp /tmp/development.env /opt/webapp/

sudo chmod -R 750 /opt/
# Install Node.js and npm
sudo npm install

sudo npm test

sudo systemctl daemon-reload
sudo systemctl enable httpd
sudo systemctl start httpd
sudo systemctl enable csye6225
sudo systemctl start csye6225
sudo systemctl status csye6225