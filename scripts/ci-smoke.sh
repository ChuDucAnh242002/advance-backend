#!/usr/bin/env bash
set -euo pipefail

frontend_url="${FRONTEND_URL:-http://127.0.0.1:3000}"
server_a_url="${SERVER_A_URL:-http://127.0.0.1:3001}"

curl --fail --silent --show-error --retry 20 --retry-connrefused \
  --retry-delay 2 --max-time 5 "$frontend_url/" >/dev/null
curl --fail --silent --show-error --retry 20 --retry-connrefused \
  --retry-delay 2 --max-time 5 "$frontend_url/api/settings/interval" \
  | jq -e '.interval | numbers > 0' >/dev/null
curl --fail --silent --show-error --retry 20 --retry-connrefused \
  --retry-delay 2 --max-time 5 "$server_a_url/socket.io/?EIO=4&transport=polling" \
  | grep -q '"sid"'

docker compose exec -T kafka /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server kafka:9092 --topic raw-emote-data \
  --from-beginning --max-messages 1 --timeout-ms 30000 | grep -q '"emote"'
