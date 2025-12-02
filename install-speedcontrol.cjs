const { exec } = require('node:child_process')
const path = require('node:path')

exec('npm i --omit=dev --no-audit --no-fund', {
  cwd: path.join(__dirname, 'bundles/nodecg-speedcontrol'),
}, (error, stdout) => {
  console.log(stdout)

  if (error)
    console.log(error)
})