pipeline {
  agent any
  environment {
    COMPOSE_PROJECT_NAME = 'sysin-fp'
    TAG = "${env.BUILD_NUMBER}"
  }
  triggers {
    githubPush()
    pollSCM('H/2 * * * *')
  }
  options { disableConcurrentBuilds(); buildDiscarder(logRotator(numToKeepStr: '15')) }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Test') {
      steps {
        sh 'docker build --no-cache-filter test --target test -t sysin-fp/items-api:test ./items-api'
        sh 'docker build --no-cache-filter test --target test -t sysin-fp/pokemon-api:test ./pokemon-api'
      }
    }

    stage('Build Images') {
      steps {
        withCredentials([file(credentialsId: 'sysin-fp-env', variable: 'ENV_FILE')]) {
          sh 'rm -f .env && cp "$ENV_FILE" .env'
          sh 'docker compose build'
        }
      }
    }

    stage('Deploy') {
      steps {
        withCredentials([file(credentialsId: 'sysin-fp-env', variable: 'ENV_FILE')]) {
          sh 'rm -f .env && cp "$ENV_FILE" .env'
          sh 'docker compose up -d --no-build --remove-orphans --wait --wait-timeout 120'
        }
      }
    }

    stage('Smoke Test') {
      steps {
        sh '''
          for i in $(seq 1 12); do
            if docker compose exec -T proxy wget -qO- http://127.0.0.1:8080/api/items/health   >/dev/null \
            && docker compose exec -T proxy wget -qO- http://127.0.0.1:8080/api/pokemon/health >/dev/null \
            && docker compose exec -T proxy wget -qO- http://127.0.0.1:8080/ | grep -q "id=\\"build\\">${TAG}<"; then
              echo "Smoke test passed (build ${TAG})"; exit 0
            fi
            echo "Waiting for services..."; sleep 5
          done
          echo "Smoke test failed"; exit 1
        '''
      }
    }
  }

  post {
    always  { sh 'rm -f .env' }
    success { echo "Build ${TAG} is live" }
    failure { echo "Build ${TAG} failed. Roll back with: TAG=<previous> docker compose up -d --no-build" }
  }
}