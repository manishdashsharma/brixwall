#!/usr/bin/env bash
set -euo pipefail

LABEL="brixwall.test=true"
DELAY="${1:-0}"

names=()
while IFS= read -r line; do names+=("$line"); done < <(docker ps -a --filter "label=$LABEL" --format '{{.Names}}')

if ((${#names[@]} == 0)); then
  echo "No test containers to remove."
  exit 0
fi

for name in "${names[@]}"; do
  docker rm -f "$name" >/dev/null
  echo "remove $name"
  sleep "$DELAY"
done
