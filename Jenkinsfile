/* This for yhe simple deployment process at the Jenkins
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
                    sudo cp -r GamifiedFrontend/dist/* /var/www/html/

                    echo "Frontend deployed successfully!"
                '''
            }
        }
        stage('Building Docker Image'){

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

/* If we want to build the Docker Image of the entire application and then deploy to the Kubernetes that is Minikube then this Pipeline will done
pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "your-dockerhub-username"
        DOCKERHUB_PASS = credentials('dockerhub-cred-id')
        BACKEND_IMAGE = "your-dockerhub-username/backend-app"
        FRONTEND_IMAGE = "your-dockerhub-username/frontend-app"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git 'https://github.com/yourrepo/project.git'
            }
        }

        stage('Build Backend JAR') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend Dist') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh """
                        # Build backend image
                        docker build -t ${BACKEND_IMAGE}:latest -f backend/Dockerfile backend/

                        # Build frontend image
                        docker build -t ${FRONTEND_IMAGE}:latest -f frontend/Dockerfile frontend/
                    """
                }
            }
        }

        stage('Push Docker Images to DockerHub') {
            steps {
                script {
                    sh """
                        echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin

                        docker push ${BACKEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:latest
                    """
                }
            }
        }

        stage('Deploy to Minikube Kubernetes') {
            steps {
                script {
                    // Point Docker CLI to Minikube environment
                    sh 'eval $(minikube docker-env)'

                    // Apply manifests
                    sh """
                        kubectl apply -f k8s/backend-deployment.yaml
                        kubectl apply -f k8s/backend-service.yaml

                        kubectl apply -f k8s/frontend-deployment.yaml
                        kubectl apply -f k8s/frontend-service.yaml
                    """
                }
            }
        }
    }
}
*/
pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'backend', url: 'https://github.com/shantisingh545/Docker-Complter.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('dashboard') {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('GamifiedFrontend') {
                    sh '''
                       node -v
                       npm -v
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Docker Build, Push & Deploy') {
    steps {
        // Wrap everything in script
        script {
            withEnv(readFile('/home/jenkins/env/docker.env').readLines()) {
                sh '''
                    echo "Backend Image = $BACKEND_IMAGE"
                    echo "Frontend Image = $FRONTEND_IMAGE"

                    # Build Docker images
                    docker build -t $BACKEND_IMAGE:latest -f dashboard/Dockerfile dashboard
                    docker build -t $FRONTEND_IMAGE:latest -f GamifiedFrontend/Dockerfile GamifiedFrontend

                    # DockerHub login
                    docker login -u $DOCKERHUB_USER -p $DOCKERHUB_PASS

                    # Push images
                    docker push $BACKEND_IMAGE:latest
                    docker push $FRONTEND_IMAGE:latest

                    # Stop and remove old containers
                    docker stop backend frontend || true
                    docker rm backend frontend || true

                    # Run new containers
                    docker run -d --name backend -p 8080:8080 $BACKEND_IMAGE:latest
                    docker run -d --name frontend -p 80:80 $FRONTEND_IMAGE:latest
                '''
            }
        }
    }
}
  }
