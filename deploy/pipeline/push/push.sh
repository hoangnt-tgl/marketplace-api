#!/bin/bash

echo "***** Pushing Docker image for backend *****"

docker login -u bekhnam -p $PASS
docker push NFTSpacex/backend:$BUILD_NUMBER