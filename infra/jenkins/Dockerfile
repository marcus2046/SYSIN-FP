FROM jenkins/jenkins:lts-jdk17

USER root

# Install Docker CLI using Docker's official automated script
RUN apt-get update && \
    apt-get install -y ca-certificates curl && \
    curl -fsSL https://get.docker.com | sh && \
    rm -rf /var/lib/apt/lists/*

# Add jenkins user to docker group if it exists
RUN groupadd -f docker && usermod -aG docker jenkins

USER jenkins
