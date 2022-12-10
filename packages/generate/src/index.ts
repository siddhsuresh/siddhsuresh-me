import { Octokit } from "@octokit/rest";
import { ArgumentParser } from "argparse";
import * as fs from "node:fs";
const parser = new ArgumentParser({
    description: "Generate a list of contributions for a given user in a given repository"
});
parser.add_argument("--author", { help: "The author of the commits" });
parser.add_argument("--owner", { help: "The owner of the repository" });
parser.add_argument("--repo", { help: "The repository name" });
parser.add_argument("--token", { help: "The GitHub token" });
const args = parser.parse_args();
const { owner, repo, author, token } = args;
const octokit = new Octokit({
    auth: token
});
console.log(`Generating contributions for ${owner}/${repo}...`);
console.log(`By Author: ${author}`);
console.log("----------------------");
async function generateContributions() {
const { data } = await octokit.search.issuesAndPullRequests({
    q: `author:${author} repo:${owner}/${repo}`,
});
const pullRequests = await Promise.all(data.items.map(async (pullRequest) => {
    const { data } = await octokit.pulls.get({
        owner,
        repo,
        pull_number: pullRequest.number,
    });
    return data;
}));
const pullRequestDetails = pullRequests.map((pullRequest) => {
    const pull_number = pullRequest.number;
    const title = pullRequest.title;
    const body = pullRequest.body;
    const comments = pullRequest.comments;
    const date = pullRequest.created_at;
    const url = pullRequest.html_url;
    const merged_at = pullRequest.merged_at;
    const commits = pullRequest.commits;
    const files = pullRequest.changed_files;
    const additions = pullRequest.additions;
    const deletions = pullRequest.deletions;
    const state = pullRequest.state === "closed" ? (pullRequest.merged ? "merged" : "closed") : pullRequest.state;
    return {
        pull_number,
        title,
        body,
        url,
        comments,
        date,
        merged_at,
        commits,
        files,
        additions,
        deletions,
        state,
    };
});
const required = pullRequestDetails.filter((pullRequest) => pullRequest.state !== "closed");
//@ts-ignore
required.repo = `${owner}/${repo}`;
const reqData = required.reduce((acc, current) => {
    acc.commits += current.commits;
    acc.files += current.files;
    acc.additions += current.additions;
    acc.deletions += current.deletions;
    return acc;
}, { commits: 0, files: 0, additions: 0, deletions: 0 });
//@ts-ignore
reqData.repo = `${owner}/${repo}`;
const commits = await Promise.all(required.map(async (pullRequest) => {
    const data = await octokit.paginate("GET /repos/{owner}/{repo}/pulls/{pull_number}/commits", {
        owner,
        repo,
        pull_number: pullRequest.pull_number,
        per_page: 100,
    });
    return data;
}));
//include the commits made the author in the main branch of the repo
const mainCommits = await octokit.paginate("GET /repos/{owner}/{repo}/commits", {
    owner,
    repo,
    author,
    per_page: 100,
});
const allCommits = commits.flat().concat(mainCommits).filter((commit) => commit.author?.login === author);
const commitDetails = allCommits.map((commit) => {
    const date = commit.commit.author?.date;
    const sha = commit.sha;
    const name = commit.commit.message;
    const value = 1;
    return {
        date,
        sha,
        name,
        value
    };
});
const commitData = commitDetails.reduce((acc, current) => {
    const date = current.date ? new Date(current.date).toDateString() : "";
    const sha = current.sha;
    const name = current.name;
    const value = current.value;
    const index = acc.findIndex((item) => item.date === date);
    if (index === -1) {
        acc.push({ date, commits: [{ sha, name, value }] });
    }
    else {
        acc[index].commits.push({ sha, name, value });
    }
    return acc;
}, [
    {
        date: "",
        commits: [
            {
                sha: "",
                name: "",
                value: 0
            }
        ],
    },
]);
const commitGroup = commitData.reduce((acc, current) => {
    const date = current.date.split("T")[0];
    //@ts-ignore
    if (!acc[date]) {
        //@ts-ignore
        acc[date] = [];
    }
    //@ts-ignore
    acc[date].push(current);
    return acc;
}, {});
const commitGroupData = Object.keys(commitGroup).map((key) => {
    return {
        repo: `${owner}/${repo}`,
        date: key,
        //@ts-ignore
        total: commitGroup[key].length,
        //@ts-ignore
        details: commitGroup[key],
    };
});
fs.mkdirSync(`src/data/${owner}/${repo}`, { recursive: true });
console.log(`Created directory src/data/${owner}/${repo}`);
fs.writeFileSync(`src/data/${owner}/${repo}/commits.json`, JSON.stringify(commitGroupData));
fs.writeFileSync(`src/data/${owner}/${repo}/summary.json`, JSON.stringify(reqData));
fs.writeFileSync(`src/data/${owner}/${repo}/opensource.json`, JSON.stringify(required));
required.forEach((pullRequest) => {
    fs.writeFileSync(`src/data/${owner}/${repo}/${pullRequest.pull_number}.md`, JSON.stringify(pullRequest.body));
})
}
generateContributions();
