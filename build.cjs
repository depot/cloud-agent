const esbuild = require('esbuild')
const {nodeExternalsPlugin} = require('esbuild-node-externals')

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outfile: 'dist/index.js',
  sourcemap: true,
  plugins: [nodeExternalsPlugin({allowList: ['execa']})],
})
