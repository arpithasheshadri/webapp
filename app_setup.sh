#!/bin/bash

# sudo chmod -R 755 /opt
# sudo cp /tmp/webapp.zip /opt/
# cd /opt || exit
# sudo unzip webapp.zip -d /opt/webapp
# sudo ls -la
# echo pwd
# sudo cp /tmp/development.env /opt/webapp
# cd /opt/webapp
# echo pwd

sudo -u csye6225 bash -c '
sudo chmod -R 750 /opt &&
sudo cp /tmp/webapp.zip /opt/ &&
cd /opt || exit &&
sudo unzip webapp.zip -d /opt/webapp &&
sudo ls -la &&
echo "$PWD" &&
sudo cp /tmp/development.env /opt/webapp &&
cd /opt/webapp &&
echo "$PWD"
'


# Install Node.js and npm
sudo npm install

sudo npm test

sudo systemctl daemon-reload
sudo systemctl enable httpd
sudo systemctl start httpd
sudo systemctl enable csye6225
sudo systemctl start csye6225
sudo systemctl status csye6225