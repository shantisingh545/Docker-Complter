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

        // 1️⃣ Checkout Code
        stage('Checkout Code') {
            steps {
                git branch: 'backend', url: 'https://github.com/shantisingh545/Docker-Complter.git'
            }
        }

        // 2️⃣ Build Backend (Spring Boot)
        stage('Build Backend') {
            steps {
                dir('dashboard') {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        // 3️⃣ Build Frontend (Angular)
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

        // 4️⃣ Docker Build & Push (optional, if you want images on DockerHub)
        stage('Docker Build & Push') {
            steps {
                script {
                    // Clean read env variables
                    def envVars = readFile('/home/jenkins/env/docker.env')
                                    .readLines()
                                    .collect { it.trim() }
                                    .findAll { it && !it.startsWith('#') }

                    withEnv(envVars) {
                        sh '''
                            echo "Building Docker images for backend and frontend..."

                            # Build backend and frontend images
                            docker build -t $BACKEND_IMAGE:latest -f dashboard/Dockerfile dashboard
                            docker build -t $FRONTEND_IMAGE:latest -f GamifiedFrontend/Dockerfile GamifiedFrontend

                            # Login to DockerHub
                            docker login -u $DOCKERHUB_USER -p $DOCKERHUB_PASS

                            # Push images
                            docker push $BACKEND_IMAGE:latest
                            docker push $FRONTEND_IMAGE:latest
                        '''
                    }
                }
            }
        }

        // 5️⃣ Deploy Backend + Postgres with Docker Compose
        stage('Deploy Backend with Postgres') {
            steps {
                script {
                    def envVars = readFile('/home/jenkins/env/docker.env')
                                    .readLines()
                                    .collect { it.trim() }
                                    .findAll { it && !it.startsWith('#') }

                    withEnv(envVars) {
                        dir('dashboard') {  // root of repo
                            sh '''
                                echo "Deploying backend + Postgres via docker-compose..."

                                # Build images according to docker-compose.yml
                                docker-compose build

                                # Start backend + Postgres in detached mode
                                docker-compose up -d --build
                            '''
                        }
                    }
                }
            }
        }

        // 6️⃣ Deploy Frontend container separately
        stage('Deploy Frontend') {
            steps {
                script {
                    def envVars = readFile('/home/jenkins/env/docker.env')
                                    .readLines()
                                    .collect { it.trim() }
                                    .findAll { it && !it.startsWith('#') }

                    withEnv(envVars) {
                        sh '''
                            echo "Deploying frontend container..."

                            # Stop/remove old frontend container
                            docker stop frontend || true
                            docker rm frontend || true

                            # Run frontend container
                            docker run -d --name frontend -p 4200:4200 $FRONTEND_IMAGE:latest
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "🚀 Application deployed successfully!"
            echo "Backend: http://localhost:9090"
            echo "Frontend: http://localhost:4200"
        }
        failure {
            echo "❌ Pipeline failed. Check Jenkins logs."
        }
    }
}
