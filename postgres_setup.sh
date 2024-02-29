#!/bin/bash

# Install PostgreSQL
sudo yum install -y postgresql-server postgresql-contrib

# Initialize PostgreSQL database
sudo postgresql-setup initdb

# Start PostgreSQL service
sudo systemctl start postgresql

# Enable PostgreSQL service to start on boot
sudo systemctl enable postgresql

# Create a new user and database in PostgreSQL
# sudo -u postgres psql -c "CREATE USER cloud_arpitha WITH PASSWORD 'postgres';" 2>/dev/null
# sudo -u postgres psql -c "CREATE DATABASE cloud_arpitha OWNER cloud_arpitha;" 2>/dev/null
# sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cloud_arpitha TO cloud_arpitha;" 2>/dev/null
# sudo sed -i "s/ident/md5/g" /var/lib/pgsql/data/pg_hba.conf

sudo -u postgres psql -c "CREATE USER $USER WITH PASSWORD '$PASSWORD';" 2>/dev/null
sudo -u postgres psql -c "CREATE DATABASE $USER OWNER $USER;" 2>/dev/null
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $USER TO $USER;" 2>/dev/null
# Find and edit pg_hba.conf
PG_HBA_CONF=$(sudo find / -name "pg_hba.conf" 2>/dev/null)
if [ -n "$PG_HBA_CONF" ]; then
    sudo sed -i "s/ident/md5/g" "$PG_HBA_CONF"
    # Add configuration to allow connections from any IP address with password authentication
    echo "host    all             all             0.0.0.0/0               md5" | sudo tee -a "$PG_HBA_CONF" >/dev/null
    # Restart PostgreSQL service for changes to take effect
    sudo systemctl restart postgresql
else
    echo "pg_hba.conf not found."
fi
# Configure PostgreSQL to allow connections from external hosts (if needed)
# Edit the PostgreSQL configuration file: /var/lib/pgsql/data/pg_hba.conf
# Add the following line to allow connections from any IP address with password authentication:
# host    all             all             0.0.0.0/0               md5

# Restart PostgreSQL service for changes to take effect
# sudo systemctl restart postgresql
