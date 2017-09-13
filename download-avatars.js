// Requirements

const dotenvStatus = require('dotenv').config();
const request = require('request');
const fs = require('fs');
const githubUser = process.env.GITHUB_USER;
const githubToken = process.env.GITHUB_ACCESS_TOKEN;

// Function Definitions

const getRepoContributors = function (repoOwner, repoName, cb) {
  const requestURL = 'https://' + githubUser + ':' + githubToken + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  const options = {
    url: requestURL,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  };
  request(options, (error, response, body) => {
    if (response.statusCode === 404) {
      console.log('Response code was 404 - Not Found. I don\'t think that User/Repo exists!');
    } else {
      const parsed = JSON.parse(body);
      if (parsed.message) {
        console.log(`GitHub message: ${parsed.message}`);
      } else {
        cb(parsed);
      }
    }
  });
};

const downloadImageByURL = function (url, file) {
  if (!fs.existsSync('./avatars/')) {
    fs.mkdir('avatars');
  }
  let imageType;
  request(url, (err, response, body) => {
    imageType = response.headers['content-type'].substring(6);
  })
    .pipe(fs.createWriteStream(`./avatars/${file}`)
      .on('close', (err) => {
        fs.rename(`./avatars/${file}`, `./avatars/${file}.${imageType}`);
      }));
};

//Begin User Interaction

console.log('Welcome to the GitHub Avatar Downloader!');

switch (true) {
case process.argv.length !== 4:
  console.log('Usage: node download-avatars.js <owner> <repo>');
  break;
case Object.keys(dotenvStatus)[0] === 'error':
  console.log('Couldn\'t read your .env file. Is it missing?');
  break;
case githubUser === undefined || githubToken === undefined:
  console.log('Your .env is missing GitHub Authentication information!');
  break;
default: {
  const owner = process.argv[2];
  const repo = process.argv[3];
  getRepoContributors(owner, repo, (data) => {
    data.forEach((user) => {
      fileName = user.login;
      downloadImageByURL(user.avatar_url, fileName);
    });
  });
}
}

