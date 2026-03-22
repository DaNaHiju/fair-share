pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'your-dockerhub-username/fairshare-backend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        APP_SERVER_IP = credentials('app-server-ip')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Test') {
            steps {
                dir('backend') {
                    sh '''
                        python3 -m venv venv
                        . venv/bin/activate
                        pip install -r requirements.txt
                        pytest
                    '''
                }
            }
        }
        
        stage('Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB_CREDENTIALS', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh '''
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -f Dockerfile.backend .
                        docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    '''
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sshagent(['APP_SERVER_SSH']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@${APP_SERVER_IP} "
                            cd /opt/fairshare &&
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
            echo "Deployed successfully!"
        }
        failure {
            echo "Pipeline failed."
        }
    }
}
