// Requirements

require('dotenv').config();
const request = require('request');
const fs = require('fs');
const githubUser = process.env.GITHUB_USER;
const githubToken = process.env.GITHUB_ACCESS_TOKEN;

// Function Definitions

const getRepoContributors = function(repoOwner, repoName, cb) {
  const requestURL = 'https://' + githubUser + ':' + githubToken + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  const options = {
    url: requestURL,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  };
  request(options, (error, response, body) => {
    if (response.statusCode !== 200) {
      console.log('Response code was not OK. I don\'t think that User/Repo exists!');
    } else {
      cb(JSON.parse(body));
    }
  });
};

const downloadImageByURL = function (url, filepath) {
  if (!fs.existsSync('./avatars/')) {
    fs.mkdir('avatars');
  }
    request(url)
    .pipe(fs.createWriteStream(filepath));
};

//Begin User Interaction

console.log('Welcome to the GitHub Avatar Downloader!');

if (process.argv.length !== 4) {
  console.log('Usage: node download-avatars.js <owner> <repo>');
} else {
  const owner = process.argv[2];
  const repo = process.argv[3];
  getRepoContributors(owner, repo, (data) => {
    data.forEach((user) => {
      fileTarget = './avatars/' + user.login + '.png';
      downloadImageByURL(user.avatar_url, fileTarget);
    });
  });
}