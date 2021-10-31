/* eslint-disable camelcase */
import {auth, sheets, sheets_v4} from '@googleapis/sheets';
import {OAuth2Client} from 'google-auth-library';
import Resource$Spreadsheets = sheets_v4.Resource$Spreadsheets;
import {GaxiosResponse} from 'googleapis-common';
import Params$Resource$Spreadsheets$Values$Get = sheets_v4.Params$Resource$Spreadsheets$Values$Get;
// eslint-disable-next-line max-len
import Params$Resource$Spreadsheets$Values$Clear = sheets_v4.Params$Resource$Spreadsheets$Values$Clear;
// eslint-disable-next-line max-len
import Params$Resource$Spreadsheets$Values$Append = sheets_v4.Params$Resource$Spreadsheets$Values$Append;
// eslint-disable-next-line max-len
import Params$Resource$Spreadsheets$Values$Update = sheets_v4.Params$Resource$Spreadsheets$Values$Update;
import Schema$ValueRange = sheets_v4.Schema$ValueRange;
import Schema$AppendValuesResponse = sheets_v4.Schema$AppendValuesResponse;
import Schema$UpdateValuesResponse = sheets_v4.Schema$UpdateValuesResponse;
import Schema$ClearValuesResponse = sheets_v4.Schema$ClearValuesResponse;

const tokenCred = {
  access_token: process.env.ACCESS_TOKEN,
  refresh_token: process.env.REFRESH_TOKEN,
  scope: process.env.SCOPE,
  token_type: process.env.TOKEN_TYPE,
  expiry_date: parseInt(process.env.EXPIRY_DATE || ''),
};

const secretCred = {
  client_secret: process.env.CLIENT_SECRET,
  client_id: process.env.CLIENT_ID,
  redirect_uris: [process.env.REDIRECT_URI],
};

class GoogleSpreadsheetClient {
  private authClient: OAuth2Client | null = null;
  private sheets: Resource$Spreadsheets | null = null;

  public init() {
    return this.authorize().then((oauthClient) => {
      this.authClient = oauthClient;
      this.sheets = sheets({version: 'v4', auth: this.authClient}).spreadsheets;
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

  private authorize(): Promise<OAuth2Client> {
    const {client_secret, client_id, redirect_uris} = secretCred;
    const oAuth2Client = new auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );
    oAuth2Client.setCredentials(tokenCred);
    return Promise.resolve(oAuth2Client);
  }
}

export const GSPClient = new GoogleSpreadsheetClient();
