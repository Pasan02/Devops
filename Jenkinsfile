pipeline {
    agent any

    triggers {
        pollSCM 'H/10 * * * *' 
    }

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
                   // Retrieve secrets from Jenkins Credentials
                   withCredentials([
                       usernamePassword(credentialsId: 'mongo-creds', usernameVariable: 'MONGO_USER', passwordVariable: 'MONGO_PASSWORD'),
                       string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET'),
                       string(credentialsId: 'tmdb-api-key', variable: 'TMDB_API_KEY')
                   ]) {
                       script {
                            def remote = "ubuntu@${env.SERVER_IP}"
                            
                            // Create .env file securely in workspace
                            writeFile file: '.env', text: """
MONGO_USER=${MONGO_USER}
MONGO_PASSWORD=${MONGO_PASSWORD}
JWT_SECRET=${JWT_SECRET}
TMDB_API_KEY=${TMDB_API_KEY}
"""
                            
                            // Wait for SSH to be ready
                            sh "sleep 30" 
                            
                            // Compress files excluding node_modules and .git to speed up transfer
                            sh "rm -f project.tar.gz"
                            // Using '|| true' to suppress exit code 1 if file changes during read (benign warning)
                            // Clean up local .env after packing (or include it in packing? secure cp is better)
                            // We will scp the .env file separately to ensure it arrives
                            sh "tar -czf project.tar.gz --exclude=node_modules --exclude=.git --exclude=.terraform --exclude=project.tar.gz --exclude=.env . || true"
                            
                            // Transfer the single tarball and the .env file
                            sh "scp -o StrictHostKeyChecking=no project.tar.gz ${remote}:/home/ubuntu/"
                            sh "scp -o StrictHostKeyChecking=no .env ${remote}:/home/ubuntu/.env"
                            
                            // Unzip and Deploy
                            sh """
                            ssh -o StrictHostKeyChecking=no ${remote} '
                                docker compose down || true
                                
                                # Use sudo to remove the directory because it might have been created by root/docker previously
                                sudo rm -rf nginx nginx-config
                                
                                # Extract files (which includes the nginx folder)
                                tar -xzf project.tar.gz
                                
                                # Deploy (Docker Compose automatically reads .env file)
                                docker compose up -d --build
                            '
                            """
                            
                            // Clean up local .env file
                            sh "rm .env"
                       }
                   }
                }
            }
        }
    }
}
