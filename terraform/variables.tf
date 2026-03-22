variable "aws_region" {
  default = "us-east-1"
}

variable "ami_id" {
  description = "Ubuntu 22.04 LTS AMI"
}

variable "instance_type" {
  default = "t3.micro"
}

variable "key_name" {
  description = "Your EC2 SSH key pair name"
}

variable "allowed_ssh_cidr" {
  description = "Your IP CIDR for SSH access"
}
