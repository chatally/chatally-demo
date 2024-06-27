#!/usr/bin/env bash
# Use strict mode and setup defined execution context:
set -euo pipefail
IFS=$'\t\n'

# Derive the site from the directory name, e.g. preview.dooiy.org
caller_dir=${PWD}
cd "$(dirname "$0")"
site=${PWD##*/}
stack="${site//./_}"

echo "(Re-)starting stack ${stack} from ${PWD}..."

# Stop if stack is running:
if [[ -n $(docker stack ps "${stack}" 2>/dev/null) ]]; then
  echo "⚠️ Stack '${stack}' is running, stopping it..." 1>&2
  docker stack rm ${stack}
  # The name is the name of the service
  docker wait $(docker ps -q -f name=${stack}_app) 1>/dev/null 2>&1
  echo -e "\b\b ✔️"
fi

echo "Building required docker image..."
docker build --tag "chatally/demo-app" .
echo -e "\b\b ✔️"

## Run
export SITE="${site}"
export STACK="${stack}"
echo "Starting your site..."
docker stack deploy -c docker-compose.yml ${stack}
echo -e "\b\b ✔️"

# Provide a link to the site's entrypoints
echo
echo "☀️ Visit your new site (${stack}) at https://${site}"
