import { execSync } from 'node:child_process';

import pkg from './getPackage.js';

const comfyRepo = 'https://github.com/hanzoai/Hanzo Studio';
const managerRepo = 'https://github.com/ltdrdata/Hanzo Studio-Manager';

/** Suppress warning about detached head */
const noWarning = '-c advice.detachedHead=false';

if (pkg.config.comfyUI.optionalBranch) {
  // Checkout branch.
  execAndLog(`git clone ${comfyRepo} --depth 1 --branch ${pkg.config.comfyUI.optionalBranch} assets/Hanzo Studio`);
} else {
  // Checkout tag as branch.
  execAndLog(`git ${noWarning} clone ${comfyRepo} --depth 1 --branch v${pkg.config.comfyUI.version} assets/Hanzo Studio`);
}
execAndLog(`git clone ${managerRepo} assets/Hanzo Studio/custom_nodes/Hanzo Studio-Manager`);
execAndLog(
  `cd assets/Hanzo Studio/custom_nodes/Hanzo Studio-Manager && git ${noWarning} checkout ${pkg.config.managerCommit} && cd ../../..`
);
execAndLog(`yarn run make:frontend`);
execAndLog(`yarn run download:uv all`);
execAndLog(`yarn run patch:core:frontend`);
/**
 * Run a command and log the output.
 * @param {string} command The command to run.
 */
function execAndLog(command) {
  const output = execSync(command, { encoding: 'utf8' });
  console.log(output);
}
