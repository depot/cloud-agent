# cloud-agent [![CI](https://github.com/depot/cloud-agent/workflows/CI/badge.svg)](https://github.com/depot/cloud-agent/actions)

Agent process that manages cloud infrastructure for self-hosted Depot connections.

## Endpoints

- `GET /api/agents/cloud/:id/desired-state`
- `POST /api/agents/cloud/:id/current-state`

## Release

### Fly.io

Update fly with:

```sh
MACHINE_ID=$(flyctl machines list --app depot-cloud-agent -j|jq -r  '.[0].id')
flyctl machine update $MACHINE_ID --app depot-cloud-agent --image ghcr.io/depot/cloud-agent:2.30.1 --yes
```
