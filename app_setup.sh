#!/bin/bash

sudo chmod -R 755 /opt
sudo cp /tmp/webapp.zip /opt/
cd /opt || exit
sudo unzip webapp.zip
sudo cp /tmp/development.env /opt/webapp/
cd /opt/webapp


# Install Node.js and npm
sudo npm install

sudo npm test

sudo systemctl daemon-reload
sudo systemctl enable httpd
sudo systemctl start httpd
sudo systemctl enable csye6225
sudo systemctl start csye6225
sudo systemctl status csye6225