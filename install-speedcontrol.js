import { exec } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

exec('npm i --omit=dev --no-audit --no-fund', {
  cwd: join(__dirname, 'bundles/nodecg-speedcontrol'),
}, (error, stdout) => {
  console.log(stdout)

  if (error)
    console.log(error)
})