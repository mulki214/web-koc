#!/usr/bin/env bash
set -euo pipefail

# Installed as /usr/local/bin/knockoutclub-deploy and used as a forced SSH command.
request=${SSH_ORIGINAL_COMMAND:-}
if [[ ! "$request" =~ ^deploy\ ([0-9a-f]{40})$ ]]; then
  echo 'Expected: deploy <40-character main commit SHA>' >&2
  exit 2
fi
expected_sha=${BASH_REMATCH[1]}

cd /opt/knockoutclub
exec 9>.deploy.lock
flock -w 600 9

test "$(git branch --show-current)" = main
git diff --quiet
git diff --cached --quiet
git fetch --quiet origin main
latest_sha=$(git rev-parse refs/remotes/origin/main)
if [[ "$latest_sha" != "$expected_sha" ]]; then
  echo "Skipping superseded commit $expected_sha; current main is $latest_sha"
  exit 0
fi

git merge --ff-only origin/main
compose=(docker compose --env-file .env.production -f compose.production.yaml)
"${compose[@]}" config --quiet
"${compose[@]}" build migrate web
"${compose[@]}" up -d db
"${compose[@]}" run --rm migrate
"${compose[@]}" up -d --no-deps --force-recreate web

for attempt in {1..30}; do
  if curl --fail --silent --show-error --output /dev/null http://127.0.0.1:3001/ &&
     curl --fail --silent --show-error --output /dev/null https://knockoutclub.id/; then
    echo "Deployed $expected_sha successfully"
    exit 0
  fi
  sleep 2
done

"${compose[@]}" ps
echo 'Deployment did not pass the HTTP health checks' >&2
exit 1
