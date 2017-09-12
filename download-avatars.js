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
  }
  request(options, (error, response, body) => {
    console.log(body); 
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});