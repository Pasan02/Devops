pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID     = credentials('aws-access-key')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-key')
        AWS_DEFAULT_REGION    = 'us-east-1'
        SSH_PRIVATE_KEY       = credentials('ec2-ssh-key') // ID of SSH key credential in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Provision Infrastructure') {
            steps {
                dir('terraform') {
                    sh 'terraform init'
                    sh 'terraform apply -auto-approve'
                    
                    // Capture IP address for deployment
                    script {
                        env.SERVER_IP = sh(script: "terraform output -raw public_ip", returnStdout: true).trim()
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                   script {
                        def remote = "ubuntu@${env.SERVER_IP}"
                        
                        // Wait for SSH to be ready (rudimentary check)
                        sh "sleep 30" 
                        
                        // StrictHostKeyChecking=no to avoid prompt for new servers
                        sh "scp -o StrictHostKeyChecking=no -r docker-compose.yml backend frontend nginx mongodb-init ${remote}:/home/ubuntu/"
                        
                        sh """
                        ssh -o StrictHostKeyChecking=no ${remote} '
                            export TMDB_API_KEY="5d48393e4f2ef4e995c297e64192374d" && \
                            docker compose down && \
                            docker compose up -d --build
                        '
                        """
                   }
                }
            }
        }
    }
}
