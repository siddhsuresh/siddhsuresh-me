import * as core from '@actions/core';
const { exec } = require('child_process');

function generateData(username, repo, token) {
    const [owner, repoName] = repo.split('/');
    const child = exec(`node generate-data/index.js --author ${username} --owner ${owner} --repo ${repoName} --token ${token}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    child.stdout.on('data', (data) => {
        console.log(`stdout: ${data.toString()}`);
    });
    child.on('exit', (code) => {
        console.log(`child process exited with code ${code.toString()}`);
    });
}

function run() {
    try {
        const username = core.getInput('username');
        const repo = core.getInput('repo');
        const token = core.getInput('token');
        core.setSecret(token);
        if (Array.isArray(repo)) {
            repo.forEach((repo) => {
                generateData(username, repo, token);
            });
        }
        else {
            generateData(username, repo, token);
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();