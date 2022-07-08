# cloud-agent [![CI](https://github.com/depot/cloud-agent/workflows/CI/badge.svg)](https://github.com/depot/cloud-agent/actions)

Agent process that manages cloud infrastructure for self-hosted Depot connections.

## Endpoints

- `POST /api/agents/cloud/:id/health`
- `GET /api/agents/cloud/:id/get-desired-state`
- `POST /api/agents/cloud/:id/current-state`
