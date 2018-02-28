const fs         = require('fs');
const readline   = require('readline');
const google     = require('googleapis');
const googleAuth = require('google-auth-library');
const request    = require('request');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/gmail-nodejs-quickstart.json
const SCOPES    = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
  '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

const content = require('./client_secret');

authorize(content, enableWatch);

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const clientId     = credentials.installed.client_id;
  const clientSecret = credentials.installed.client_secret;
  const redirectUrl  = credentials.installed.redirect_uris[0];

  const auth         = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, { encoding: 'utf8' }, function(err, token) {
    if (err || !token) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url: ', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }

      oauth2Client.credentials = token;

      storeToken(token);

      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function enableWatch(auth) {
  const gmail = google.gmail('v1');

  const options = {
    userId: 'me',
    auth,
    resource: {
      labelIds: ['INBOX'],
      topicName: 'projects/automated-lead-storage-system/topics/lead-listener'
    }
  };

  gmail.users.watch(options, function(err, res) {
    if (err) throw err;

    console.log(res);
  });
}
