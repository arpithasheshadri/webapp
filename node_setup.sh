#!/bin/bash

curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo dnf install nodejs -y

# Install unzip
sudo dnf install -y unzip
 
sudo dnf install httpd -y
