const { exec } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const bundlePath = path.join(__dirname, 'bundles/nodecg-speedcontrol');

if (
  !fs.existsSync(bundlePath) ||
  !fs.existsSync(path.join(bundlePath, 'package.json'))
) {
  console.log('[speedcontrol] Bundle not found. Check if you cloned with submodules. Fixup with: git submodule update --init --recursive');
  process.exit(1);
}

exec(
  'npm install --omit=dev --no-audit --no-fund',
  { cwd: bundlePath },
  (error, stdout, stderr) => {
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    if (error) {
      console.error(
        '[speedcontrol] Dependency installation failed:',
        error.message
      );
      process.exitCode = 1;
    }
  }
);
