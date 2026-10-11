pipeline {
  agent any
  environment {
    COMPOSE_PROJECT_NAME = 'sysin-fp'            // same project as `name:` in compose
    TAG = "${env.BUILD_NUMBER}"                  // -> sysin-fp/<service>:<TAG>
  }
  triggers {
    githubPush()                                 // webhook (via ngrok), and/or:
    pollSCM('H/2 * * * *')                       // fallback — "Build Now" does not count as automatic
  }
  options { disableConcurrentBuilds(); buildDiscarder(logRotator(numToKeepStr: '15')) }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Test') {                              // MUST fail the build before Deploy
      steps {
        sh 'docker build --no-cache-filter test --target test -t sysin-fp/items-api:test ./items-api'
        sh 'docker build --no-cache-filter test --target test -t sysin-fp/pokemon-api:test ./pokemon-api'
      }
    }

    stage('Build Images') {
      steps {
        // .env is needed here too, because compose validates the ${VAR:?} entries
        withCredentials([file(credentialsId: 'sysin-fp-env', variable: 'ENV_FILE')]) {
          sh 'cp "$ENV_FILE" .env'
          sh 'docker compose build'
        }
      }
    }

    stage('Deploy') {
      steps {
        withCredentials([file(credentialsId: 'sysin-fp-env', variable: 'ENV_FILE')]) {
          sh 'cp "$ENV_FILE" .env'
          sh 'docker compose up -d --no-build --remove-orphans --wait --wait-timeout 120'
        }
      }
    }

    stage('Smoke Test') {                        // runs INSIDE the compose network via the proxy container
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