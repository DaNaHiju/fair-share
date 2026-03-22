pipeline {
    agent any
    
    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = credentials('aws-account-id')
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        DOCKER_IMAGE = "${ECR_REGISTRY}/fairshare-backend"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        APP_SERVER_IP = credentials('app-server-ip')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build & Test') {
            steps {
                sh '''
                    docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -f Dockerfile.backend .
                    docker run --rm ${DOCKER_IMAGE}:${DOCKER_TAG} pytest
                '''
            }
        }
        
        stage('Push to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                sshagent(['APP_SERVER_SSH']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@${APP_SERVER_IP} "
                            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY} &&
                            cd /opt/fairshare &&
                            export DOCKER_IMAGE=${DOCKER_IMAGE} &&
                            export DOCKER_TAG=${DOCKER_TAG} &&
                            docker-compose pull &&
                            docker-compose up -d
                        "
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo "Deployed to ECR successfully!"
        }
        failure {
            echo "Pipeline failed."
        }
    }
}
