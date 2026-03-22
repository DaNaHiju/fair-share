output "app_server_ip" {
  value = aws_instance.app_server.public_ip
}

output "jenkins_server_ip" {
  value = aws_instance.jenkins_server.public_ip
}

output "app_url" {
  value = "http://${aws_instance.app_server.public_ip}"
}

output "jenkins_url" {
  value = "http://${aws_instance.jenkins_server.public_ip}:8080"
}
