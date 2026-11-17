#!/usr/bin/env bash
set -euo pipefail

ROUNDS="${1:-10}"
DELAY="${2:-4}"
LABEL="brixwall.test=true"

for ((round = 0; round < ROUNDS; round++)); do
  running=()
  while IFS= read -r line; do running+=("$line"); done < <(docker ps --filter "label=$LABEL" --format '{{.Names}}')
  stopped=()
  while IFS= read -r line; do stopped+=("$line"); done < <(docker ps --filter "label=$LABEL" --filter status=exited --format '{{.Names}}')

  if ((${#running[@]} == 0 && ${#stopped[@]} == 0)); then
    echo "No test containers. Run ./spawn.sh first." >&2
    exit 1
  fi

  if ((${#stopped[@]} > 0 && RANDOM % 2 == 0)); then
    name="${stopped[$((RANDOM % ${#stopped[@]}))]}"
    docker start "$name" >/dev/null
    echo "start  $name"
  elif ((${#running[@]} > 0)); then
    name="${running[$((RANDOM % ${#running[@]}))]}"
    docker stop --time 1 "$name" >/dev/null
    echo "stop   $name"
  fi

  sleep "$DELAY"
done
