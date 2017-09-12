require('dotenv').config();
const request = require('request');
const githubUser = process.env.GITHUB_USER;
const githubToken = process.env.GITHUB_ACCESS_TOKEN;

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
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
}

getRepoContributors("jquery", "jquery", function(data) {
  data.forEach((user) => {
    console.log(user.avatar_url);
  });
});