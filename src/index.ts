import * as http from 'node:http'

async function main() {
  http
    .createServer((_, res) => {
      res.setHeader('Content-Type', 'application/json').end(JSON.stringify({ok: true}))
    })
    .listen(3333)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
