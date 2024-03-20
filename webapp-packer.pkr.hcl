packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1"
    }
  }
}

source "googlecompute" "webapp-packer" {
  project_id          = var.project_id
  source_image_family = var.source_image_family
  image_name          = "centos-stream-8-${formatdate("YYYY-MM-DD-hh-mm-ss", timestamp())}"
  ssh_username        = var.ssh_username
  zone                = var.zone
}

build {
  sources = ["sources.googlecompute.webapp-packer"]
  name    = "webapp-build"
  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }
  provisioner "file" {
    source      = "./csye6225.service"
    destination = "/tmp/csye6225.service"
  }

  provisioner "shell" {
    script = "./os_update.sh"
  }

  provisioner "shell" {
    script = "./user-creation.sh"
  }
  provisioner "shell" {
    script = "./node_setup.sh"
  }

  provisioner "shell" {
    script = "./ops_agent_setup.sh"
  }

  provisioner "shell" {
    script = "./app_setup.sh"
  }

}
