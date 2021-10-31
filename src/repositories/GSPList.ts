import {IListStorage} from '..//repositories/interfaces';
import {GSPClient} from '../services/GoogleSpreadsheets';

export class GSPListStorage implements IListStorage {
  private readonly spreadsheetId =
    '1QyXy3TR-yGeSRwofCDJuBEs-WuG2ZyQ_AWNsljnMnks';
  private readonly column = 'A';
  private readonly rowOffset = 2;
  private readonly range = `${this.column}${this.rowOffset}:${this.column}`;

  private getAbsoluteIndex(listIndex: number): number {
    return listIndex + this.rowOffset - 1;
  }

  private getRange(index: number): string {
    return `${this.column}${index}:${this.column}`;
  }

  add(items: string[]): ReturnType<typeof GSPClient['update']> {
    const {spreadsheetId} = this;

    const values = items.map((item) => [item]);

    return this.getAll().then(({length}) => {
      const lastItemPosition = this.getAbsoluteIndex(length);
      const range = this.getRange(lastItemPosition + 1);

      return GSPClient.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {values, range},
      });
    });
  }

  delete(index: number): ReturnType<typeof GSPClient['update']> {
    const {spreadsheetId} = this;

    const deleteCellPosition = this.getAbsoluteIndex(index);
    const copyRange = this.getRange(deleteCellPosition + 1);
    const updateRange = this.getRange(deleteCellPosition);

    return GSPClient.read({spreadsheetId, range: copyRange})
      .then(({data: {values}}) => values || [])
      .then((values) =>
        GSPClient.update({
          spreadsheetId,
          range: updateRange,
          valueInputOption: 'RAW',
          requestBody: {
            values: [...values, ['']],
          },
        }),
      );
  }

  deleteAll(): ReturnType<typeof GSPClient['clear']> {
    const {spreadsheetId, range} = this;
    return GSPClient.clear({spreadsheetId, range});
  }

  getAll(): Promise<string[]> {
    const {spreadsheetId, range} = this;
    return GSPClient.read({spreadsheetId, range}).then(
      ({data: {values}}) => values?.map((row) => row[0]) || [],
    );
  }
}
