# cloud-agent [![CI](https://github.com/depot/cloud-agent/workflows/CI/badge.svg)](https://github.com/depot/cloud-agent/actions)

Agent process that manages cloud infrastructure for self-hosted Depot connections.

## Endpoints

- `GET /api/agents/cloud/:id/desired-state`
- `POST /api/agents/cloud/:id/current-state`

## Release

### Fly.io

Update fly with:

```sh
flyctl deploy --ha=false
```
