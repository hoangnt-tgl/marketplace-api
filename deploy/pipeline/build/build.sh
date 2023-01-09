#!/bin/bash

echo "***** Building Docker image for backend *****"

docker image build -t NFTSpacex/backend:$BUILD_NUMBER .