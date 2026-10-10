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

# http://localhost:8080/ - password: 7e57bd79e9d1448fa528f2c2d4db3ad6
# Username: LorenzInfrastructure
# Password: 12345
# Fullname: Lorenz David Ruby
# E-mail address: lorenzdavidruby@gmail.com