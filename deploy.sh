docker build -t devsum-twitter-worker .
docker tag -f devsum-twitter-worker tutum.co/iteamdev/devsum-twitter-worker
docker push tutum.co/iteamdev/devsum-twitter-worker
