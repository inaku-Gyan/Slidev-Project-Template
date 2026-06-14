import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const isCi = process.env.CI === 'true' || process.env.CI === '1'
const shouldSkip = isCi || process.env.SKIP_SKILLS_INSTALL

if (shouldSkip) {
  console.log('Skipping project skills install.')
  process.exit(0)
}

if (!existsSync('skills-lock.json')) {
  console.log('No skills-lock.json found; skipping project skills install.')
  process.exit(0)
}

const command = process.platform === 'win32' ? 'skills.cmd' : 'skills'
const result = spawnSync(command, ['experimental_install'], {
  stdio: 'inherit',
  env: process.env,
})

if (result.error) {
  console.error(`Failed to run ${command}: ${result.error.message}`)
  process.exit(1)
}

process.exit(result.status ?? 1)
