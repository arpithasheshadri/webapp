#!/bin/bash

# install ops agent command
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

logging_config=$(cat <<EOF
logging:
  receivers:
    my-app-receiver:
      type: files
      include_paths:
        - /var/log/webapp.log
      record_log_file_path: true
  processors:
    my-app-processor:
      type: parse_json
      time_key: time
      time_format: "YYYY-MM-DDTHH:MM:SS.sssZ"
  service:
    pipelines:
      default_pipeline:
        receivers: [my-app-receiver]
        processors: [my-app-processor]
EOF
)

# Backup the original config file
sudo cp /etc/google-cloud-ops-agent/config.yaml /etc/google-cloud-ops-agent/config.yaml.backup

# Add the logging configuration to the config file
echo "$logging_config" | sudo tee -a /etc/google-cloud-ops-agent/config.yaml > /dev/null


sudo systemctl restart google-cloud-ops-agent

sudo touch /var/log/webapp.log
sudo chown csye6225:csye6225 /var/log/webapp.log