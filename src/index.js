import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as installer from './installer';
import { parseFlagsToArray } from './utils';

// Github Actions Inputs
const list = core.getInput('list', { required: true });
const output = core.getInput('output', { required: false });
const json = core.getBooleanInput('json', { required: false });
const flags = core.getInput('flags', { required: false });

let execOutput = '';
let execError = '';

const options = {};
options.listeners = {
  stdout: (data) => {
    execOutput += data.toString();
  },
  stderr: (data) => {
    execError += data.toString();
  }
};

async function run() {
	try {
		// download and install
		const binPath = await installer.downloadAndInstall();
        const params = [];

        if (!list) {
        core.setFailed('You need to provide a list of urls for HTTPx.');
        return
        }

        // Setting up flags
        if (list) params.push(`-list=${list}`);
        params.push(`-o=${ output ? output : 'httpx.log' }`);
        if (json) params.push('-json');

        if (flags) params.push(...parseFlagsToArray(flags));

        // execute the final command with parsed flags
        exec.exec(binPath, params, options);
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();