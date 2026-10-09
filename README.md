# Advanced Backend: Emote Stream Demo

This project demonstrates a small event-driven system that generates emote events, processes them through Kafka, and displays significant emote activity in a web interface.

## How it works

1. **Emote generator** creates a stream of sample emote events and publishes them to Kafka's `raw-emote-data` topic.
2. **Server B** consumes raw events, analyzes them in batches, and publishes significant results to `aggregated-emote-data`. It also provides the settings API.
3. **Server A** consumes aggregated results and sends them to connected browsers over Socket.IO.
4. **Frontend** displays emotes and aggregated activity. Users can enable or disable emotes and change the generation interval and aggregation threshold.

The emotes are generated sample data; the application does not connect to a live chat or external emote feed.

## Requirements

- Docker Engine or Docker Desktop with Docker Compose v2
- Ports `3000`, `3001`, `8000`, and `9092` available on your computer

Node.js is not required to run the complete application with Docker Compose.

## Install and start

Clone the repository and move into its directory if you have not already done so:

```bash
git clone https://github.com/ChuDucAnh242002/advance-backend.git
cd advance-backend
```

Build the images and start all services from the repository root:

```bash
docker compose up --build
```

The first start builds the application images and may take several minutes. Leave this terminal open while using the application. Open [http://localhost:3000](http://localhost:3000) in a browser.

To stop the services, press `Ctrl+C`. To stop and remove the containers afterwards, run:

```bash
docker compose down
```

## Services and addresses

| Service | Address | Purpose |
| --- | --- | --- |
| Frontend | [http://localhost:3000](http://localhost:3000) | User interface |
| Server A | `http://localhost:3001` | Socket.IO stream of aggregated emote events |
| Server B | `http://localhost:8000` | Settings REST API |
| Kafka | `localhost:9092` | Message broker |

The frontend proxies settings requests under `/api/` to Server B. The available endpoints are:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET`, `POST` | `/settings/allowed-emotes` | Read emotes or enable/disable one (`{"id":"1","action":"disable"}`) |
| `GET`, `POST` | `/settings/interval` | Read or set the generation interval in milliseconds (`{"interval":1000}`) |
| `GET`, `POST` | `/settings/threshold` | Read or set the aggregation threshold from `0` to `1` (`{"threshold":0.5}`) |

The initial settings are defined in [`backend/server_b/config.json`](backend/server_b/config.json): a `1000` ms generation interval, a `0.5` threshold, and five active emotes. Settings changed while the app is running are written inside the Server B container; they are not persisted if that container is removed and recreated.

## Repository layout

```text
backend/
  emotegen/    Sample emote event producer
  server_a/    Kafka consumer and Socket.IO server
  server_b/    Aggregation consumer and settings API
frontend/      React user interface and Nginx configuration
docker-compose.yml
```

## Troubleshooting

- Make sure Docker is running and the command is executed from the repository root.
- If Compose reports that a port is already allocated, stop the other process using that port and retry.
- To inspect service startup or runtime errors, use `docker compose logs -f`; press `Ctrl+C` to stop following the logs without stopping the containers.
- If a service does not start correctly, stop the stack with `docker compose down` and start it again with `docker compose up --build`.
