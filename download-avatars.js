require('dotenv').config();
const request = require('request');
const fs = require('fs');
const githubUser = process.env.GITHUB_USER;
const githubToken = process.env.GITHUB_ACCESS_TOKEN;

console.log('Welcome to the GitHub Avatar Downloader!');

const getRepoContributors = function(repoOwner, repoName, cb) {
  const requestURL = 'https://' + githubUser + ':' + githubToken + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  const options = {
    url: requestURL,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  };
  request(options, (error, response, body) => {
    const data = JSON.parse(body);
    cb(data);
  });
};

const downloadImageByURL = function (url, filepath) {
  console.log(url);
  request(url)
    .pipe(fs.createWriteStream(filepath));
};

const parseAvatarURLs = function(data) {
  data.forEach((user) => {
    fileTarget = './avatars/' + user.login + '.png';
    downloadImageByURL(user.avatar_url, fileTarget);
  });
};


getRepoContributors("jquery", "jquery", parseAvatarURLs);