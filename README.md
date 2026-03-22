# FairShare

A modern, production-ready full-stack web application for splitting group expenses.

## Tech Stack
- **Backend:** Python 3.11, Flask, SQLAlchemy, PostgreSQL
- **Frontend:** React 18, Vite, Tailwind CSS, React Router
- **DevOps:** Docker Compose, Terraform (AWS Free Tier), Jenkins CI/CD

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd fairshare
   ```

2. **Environment Variables:**
   Copy the example variables file:
   ```bash
   cp .env.example .env
   ```
   Fill in the required database passwords and secrets.

3. **Start the application with Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/health`

## Terraform Deployment (AWS)

1. Navigate to the `terraform/` directory.
2. Create your `terraform.tfvars` from the example:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```
3. Initialize and apply:
   ```bash
   terraform init
   terraform apply
   ```
4. Note the outputs for the Jenkins Server IP and App Server IP.

## Jenkins Setup
1. Access Jenkins UI via the IP output from Terraform on port `8080`.
2. Configure credentials in Jenkins:
    - `DOCKER_HUB_CREDENTIALS` (Username with password)
    - `APP_SERVER_SSH` (SSH Username with private key)
    - `app-server-ip` (Secret text containing the EC2 IP)
3. Set up a Pipeline job pointing to the Git repository containing this source code.
