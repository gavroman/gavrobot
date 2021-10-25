/* eslint-disable camelcase */
import fs from 'fs';
import readline from 'readline';
import path from 'path';

import {sheets, auth, sheets_v4} from '@googleapis/sheets';
import {OAuth2Client} from 'google-auth-library';
import Resource$Spreadsheets = sheets_v4.Resource$Spreadsheets;
import {GaxiosResponse} from 'googleapis-common';
import Params$Resource$Spreadsheets$Values$Get = sheets_v4.Params$Resource$Spreadsheets$Values$Get;
import Params$Resource$Spreadsheets$Values$Clear = sheets_v4.Params$Resource$Spreadsheets$Values$Clear;
import Params$Resource$Spreadsheets$Values$Append = sheets_v4.Params$Resource$Spreadsheets$Values$Append;
import Params$Resource$Spreadsheets$Values$Update = sheets_v4.Params$Resource$Spreadsheets$Values$Update;
import Schema$ValueRange = sheets_v4.Schema$ValueRange;
import Schema$AppendValuesResponse = sheets_v4.Schema$AppendValuesResponse;
import Schema$UpdateValuesResponse = sheets_v4.Schema$UpdateValuesResponse;
import Schema$ClearValuesResponse = sheets_v4.Schema$ClearValuesResponse;


class GoogleSpreadsheetClient {
    private SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
    private TOKEN_PATH = path.join(__dirname, '../../token.json');
    private authClient: OAuth2Client | null = null;
    private sheets: Resource$Spreadsheets | null = null;

    private authorize(credentials: any): Promise<OAuth2Client> {
        const {client_secret, client_id, redirect_uris} = credentials.web;
        const oAuth2Client = new auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        return new Promise((resolve) => {
            fs.readFile(this.TOKEN_PATH, (err, token) => {
                if (err) {
                    resolve(this.getNewToken(oAuth2Client));
                }

                oAuth2Client.setCredentials(JSON.parse(token.toString()));
                resolve(oAuth2Client);
            });
        });
    }

    private getNewToken(oAuth2Client: OAuth2Client): Promise<OAuth2Client> {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
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
                        fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
                            if (err) {
                                reject(err);
                                return console.error(err);
                            }
                            console.log('Token stored to', this.TOKEN_PATH);
                        });
                        resolve(oAuth2Client);
                    }
                });
            });
        });
    }

    public init() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, '../../secrets.json'), (err, content) => {
                if (err) {
                    reject(err);
                    return console.log('Error loading client secret file:', err);
                }

                this.authorize(JSON.parse(content.toString()))
                    .then((oauthClient) => {
                        this.authClient = oauthClient;
                        this.sheets = sheets({version: 'v4', auth: this.authClient}).spreadsheets;
                        resolve(true);
                    });
            });
        });
    }

    public read(
        params?: Params$Resource$Spreadsheets$Values$Get,
    ): Promise<GaxiosResponse<Schema$ValueRange>> {
        if (!this.sheets) {
            return Promise.reject(new Error('No client'));
        }

        return Promise.resolve(this.sheets.values.get(params));
    }

    public append(
        params: Params$Resource$Spreadsheets$Values$Append,
    ): Promise<GaxiosResponse<Schema$AppendValuesResponse>> {
        if (!this.sheets) {
            return Promise.reject(new Error('No client'));
        }

        return Promise.resolve(this.sheets.values.append(params));
    }


    public clear(
        params?: Params$Resource$Spreadsheets$Values$Clear,
    ): Promise<GaxiosResponse<Schema$ClearValuesResponse>> {
        if (!this.sheets) {
            return Promise.reject(new Error('No client'));
        }

        return Promise.resolve(this.sheets.values.clear(params));
    }

    public update(
        params?: Params$Resource$Spreadsheets$Values$Update,
    ): Promise<GaxiosResponse<Schema$UpdateValuesResponse>> {
        if (!this.sheets) {
            return Promise.reject(new Error('No client'));
        }

        return Promise.resolve(this.sheets.values.update(params));
    }
}

export const client = new GoogleSpreadsheetClient();
