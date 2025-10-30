vi Dockerfile 
# Use Ubuntu base image
FROM ubuntu:22.04

# Disable interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Update and install dependencies
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk wget curl git gnupg sudo ca-certificates lsb-release && \
    rm -rf /var/lib/apt/lists/*

# ---------------------------
# Install Jenkins
# ---------------------------
RUN wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | apt-key add - && \
    sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list' && \
    apt-get update && \
    apt-get install -y jenkins && \
    rm -rf /var/lib/apt/lists/*

# ---------------------------
# Install Docker CLI
# ---------------------------
RUN apt-get update && \
    apt-get install -y docker.io && \
    usermod -aG docker jenkins && \
    rm -rf /var/lib/apt/lists/*

# ---------------------------
# Install Maven
# ---------------------------
RUN apt-get update && \
    apt-get install -y maven && \
    rm -rf /var/lib/apt/lists/*

# ---------------------------
# Install Node.js (LTS)
# ---------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# ---------------------------
# Setup Jenkins user permissions
# ---------------------------
RUN usermod -aG sudo jenkins

# Expose Jenkins Web UI and Agent ports
EXPOSE 8080 50000

# Start Jenkins
CMD ["java", "-jar", "/usr/share/jenkins/jenkins.war"]
------------------------------------------------------------------------
# Build custom Jenkins image
docker build -t myjenkins:devops .

# Run Jenkins container
docker run -d \
  -p 8080:8080 -p 50000:50000 \
  --name jenkins-devops \
  -v jenkins_home:/var/lib/jenkins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  myjenkins:devops
=============================================================================
docker exec -it jenkins-devops cat /var/lib/jenkins/secrets/initialAdminPassword
============================================================================================= end 
