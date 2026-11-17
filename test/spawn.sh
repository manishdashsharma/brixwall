#!/usr/bin/env bash
set -euo pipefail

COUNT="${1:-12}"
DELAY="${2:-3}"
IMAGE="alpine:3.20"
LABEL="brixwall.test=true"
NAMES=(api web worker postgres redis minio socket nginx mongo queue scheduler cache auth mailer search gateway)

if ! docker info >/dev/null 2>&1; then
  echo "Docker is not running. Start Docker and try again." >&2
  exit 1
fi

docker pull --quiet "$IMAGE" >/dev/null

run_healthy() {
  docker run -d --name "$1" --label "$LABEL" \
    --health-cmd "true" --health-interval 5s --health-start-period 4s \
    "$IMAGE" sleep infinity >/dev/null
}

run_unhealthy() {
  docker run -d --name "$1" --label "$LABEL" \
    --health-cmd "false" --health-interval 5s --health-retries 2 \
    "$IMAGE" sleep infinity >/dev/null
}

run_plain() {
  docker run -d --name "$1" --label "$LABEL" "$IMAGE" sleep infinity >/dev/null
}

for ((index = 0; index < COUNT; index++)); do
  base="${NAMES[$((index % ${#NAMES[@]}))]}"
  round=$((index / ${#NAMES[@]}))
  name="brixwall-${base}"
  if ((round > 0)); then
    name="${name}-${round}"
  fi

  if docker ps -a --format '{{.Names}}' | grep -qx "$name"; then
    echo "skip   $name (already exists)"
    continue
  fi

  case $((index % 6)) in
    4) run_unhealthy "$name"; kind="unhealthy" ;;
    0 | 2) run_healthy "$name"; kind="healthcheck" ;;
    *) run_plain "$name"; kind="plain" ;;
  esac

  echo "start  $name ($kind)"
  sleep "$DELAY"
done

echo "Done. Remove them with ./cleanup.sh"
