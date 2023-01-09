#!/bin/bash

echo "***** Deploying Docker image for backend *****"

if [ $BRANCH == "DEVELOPMENT" ]; then
  cd deploy/kubernetes
  cat backend.deployment.yaml | sed "s/{{BUILD_NUMBER}}/$BUILD_NUMBER/g" | kubectl apply -f -
  kubectl apply -f backend.service.yaml
if [ $? -eq 0 ]; then
  echo "***** Okay"
else
  echo "***** Error"
fi
elif [ $BRANCH == "PRODUCTION" ]; then
  cd deploy/kubernetes
  cat backend.deployment.yaml | sed "s/{{BUILD_NUMBER}}/BUILD_NUMBER/g" | kubectl apply --kubeconfig ~/.kube/config.prod -f -
  kubectl apply --kubeconfig ~/.kube/config.prod -f backend.service.yaml

if [ $? -eq 0 ]; then
  echo "****** Okay"
else
  echo "***** Error"
fi
else
  echo "***** Error"
fi