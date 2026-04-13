#!/bin/bash

# Start Minikube
minikube start --driver=docker

# Enable Ingress
minikube addons enable ingress

# Set up local DNS for interview.local
IP=$(minikube ip)
echo "Add this to your /etc/hosts:"
echo "$IP interview.local"

echo "Minikube is ready!"
