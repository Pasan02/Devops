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
                   script {
                        def remote = "ubuntu@${env.SERVER_IP}"
                        
                        // Wait for SSH to be ready
                        sh "sleep 30" 
                        
                        // Compress files excluding node_modules and .git to speed up transfer
                        sh "rm -f project.tar.gz"
                        // Using '|| true' to suppress exit code 1 if file changes during read (benign warning)
                        sh "tar -czf project.tar.gz --exclude=node_modules --exclude=.git --exclude=.terraform --exclude=project.tar.gz . || true"
                        
                        // Transfer the single tarball
                        sh "scp -o StrictHostKeyChecking=no project.tar.gz ${remote}:/home/ubuntu/"
                        
                        // Unzip and Deploy
                        sh """
                        ssh -o StrictHostKeyChecking=no ${remote} '
                            docker compose down || true
                            
                            # Use sudo to remove the directory because it might have been created by root/docker previously
                            sudo rm -rf nginx
                            
                            # Extract files (which includes the nginx folder)
                            tar -xzf project.tar.gz
                            
                            # Deploy
                            export TMDB_API_KEY="5d48393e4f2ef4e995c297e64192374d" && \
                            docker compose up -d --build
                        '
                        """
                   }
                }
            }
        }
    }
}
