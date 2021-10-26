const path = require('path');
const fs = require('fs');
const {createInterface} = require('readline');
const {auth} = require('@googleapis/sheets');

const TOKEN_PATH = '../token.json';
const SECRET_PATH = '../secrets.json';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/* eslint-disable camelcase */
const authorize = (credentials) => {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    return new Promise((resolve) => {
        fs.readFile(path.resolve(__dirname, TOKEN_PATH), (err, token) => {
            if (err) {
                return resolve(getNewToken(oAuth2Client));
            }

            oAuth2Client.setCredentials(JSON.parse(token.toString()));
            resolve(oAuth2Client);
        });
    });
};

const getNewToken = (oAuth2Client) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve, reject) => {
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) {
                    reject(err);
                    return console.error('Error while trying to retrieve access token', err);
                }

                if (token) {
                    oAuth2Client.setCredentials(token);
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err) {
                            reject(err);
                            return console.error(err);
                        }
                        console.log('Token stored to', TOKEN_PATH);
                    });
                    resolve(oAuth2Client);
                }
            });
        });
    });
};

fs.readFile(path.join(__dirname, SECRET_PATH), (err, content) => {
    if (err) {
        return console.log('Error loading client secret file:', err);
    }

    authorize(JSON.parse(content.toString()));
});
