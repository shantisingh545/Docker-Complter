pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: 'https://github.com/shantisingh545/Docker-Complter.git'
            }
        }

        stage('Build Backend (Spring Boot)') {
            steps {
                dir('dashboard') {
                   sh 'chmod +x mvnw'
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend (Angular)') {
            steps {
                dir('GamifiedFrontend') {
                    sh 'export PATH=$PATH:/home/nisha9t/.nvm/versions/node/v18.20.7/bin'
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy Backend Locally') {
            steps {
                sh '''
                    echo "Stopping old backend..."
                    pkill -f "backend.jar" || true

                    echo "Starting new backend..."
                    nohup java -jar backend/target/*.jar > backend.log 2>&1 &
                '''
            }
        }

        stage('Deploy Frontend Locally') {
            steps {
                sh '''
                    echo "Copying Angular dist to local web directory..."

                    sudo rm -rf /var/www/html/*
                    sudo cp -r frontend/dist/* /var/www/html/

                    echo "Frontend deployed successfully!"
                '''
            }
        }
    }

    post {
        success {
            echo "Build & Deployment Successful!"
        }
        failure {
            echo "Build Failed. Fix errors."
        }
    }
}
