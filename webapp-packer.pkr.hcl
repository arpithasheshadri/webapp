packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1"
    }
  }
}

source "googlecompute" "webapp-packer" {
  project_id          = "cloud-gcp-tf"
  source_image_family = "centos-stream-8"
  image_name          = "centos-stream-8-${formatdate("YYYY-MM-DD-hh-mm-ss", timestamp())}"
  ssh_username        = "packer"
  zone                = "us-east1-b"
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
    script = "./app_setup.sh"
  }

}
