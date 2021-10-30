import {client} from '../utils/GoogleSpreadsheets';
import {IListStorage} from './interfaces';

export class GSPListStorage implements IListStorage {
    private readonly spreadsheetId = '1QyXy3TR-yGeSRwofCDJuBEs-WuG2ZyQ_AWNsljnMnks';
    private readonly column = 'A';
    private readonly startIndex = 2;
    private readonly range: string;

    constructor() {
      this.range = `${this.column}${this.startIndex}:${this.column}`;
    }

    private getAbsoluteIndex(index: number): number {
      return index + this.startIndex - 1;
    }

    add(items: string[]): Promise<any> {
      const {spreadsheetId, range} = this;

      const values = items.map((item) => [item]);

      return client.append({
        spreadsheetId,
        range,
        insertDataOption: 'INSERT_ROWS',
        valueInputOption: 'USER_ENTERED',
        requestBody: {values, range},
      });
    }

    delete(index: number): Promise<any> {
      const {spreadsheetId} = this;

      const deleteCellIndex = this.getAbsoluteIndex(index);
      const copyRange = `${this.column + (deleteCellIndex + 1)}:${this.column}`;
      const updateRange = `${this.column + deleteCellIndex}:${this.column}`;

      return client
        .read({spreadsheetId, range: copyRange})
        .then(({data: {values}}) => values || [])
        .then((values) =>
          client.update({
            spreadsheetId,
            range: updateRange,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [...values, ['']],
            },
          }));
    }

    deleteAll(): Promise<any> {
      const {spreadsheetId, range} = this;
      return client.clear({spreadsheetId, range});
    }

    getAll(): Promise<string[]> {
      const {spreadsheetId, range} = this;
      return client
        .read({spreadsheetId, range})
        .then(({data: {values}}) => values?.map((row) => row[0]) || []);
    }
}
