#!/bin/bash

# install ops agent command
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

logging_config=$(cat <<EOF
logging:
  receivers:
    web-app-receiver:
      type: files
      include_paths:
        - /var/log/webapp/webapp.log
      record_log_file_path: true
  processors:
    web-app-processor:
      type: parse_json
      time_key: time
      time_format: "YYYY-MM-DDTHH:MM:SS.sssZ"
    modify_fields:
      type: modify_fields
      fields:
        severity:
          copy_from: jsonPayload.severity
  service:
    pipelines:
      default_pipeline:
        receivers: [web-app-receiver]
        processors: [web-app-processor,modify_fields]
EOF
)


sudo cp /etc/google-cloud-ops-agent/config.yaml /etc/google-cloud-ops-agent/config.yaml.backup


echo "$logging_config" | sudo tee -a /etc/google-cloud-ops-agent/config.yaml > /dev/null


sudo systemctl restart google-cloud-ops-agent

cd /var/log
sudo mkdir webapp
cd webapp

sudo touch /var/log/webapp/webapp.log
sudo chown -R csye6225:csye6225 /var/log/webapp