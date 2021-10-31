import {GSPClient} from '../services/GoogleSpreadsheets';

export interface ListItem {
  value: string;
  done: boolean;
}

export class GSPListStorage {
  private readonly spreadsheetId =
    '1QyXy3TR-yGeSRwofCDJuBEs-WuG2ZyQ_AWNsljnMnks';
  private readonly columnStart = 'A';
  private readonly columnEnd = String.fromCharCode(
    this.columnStart.charCodeAt(0) + 1,
  );
  private readonly rowOffset = 1;
  private readonly range = `${this.columnStart}${this.rowOffset}:${this.columnEnd}`;

  private getAbsoluteIndex(listIndex: number): number {
    return listIndex + this.rowOffset - 1;
  }

  private getRange(index: number): string {
    return `${this.columnStart}${index}:${this.columnEnd}`;
  }

  add(items: string[]): ReturnType<typeof GSPClient['update']> {
    const {spreadsheetId} = this;

    const values = items.map((item) => [item, false]);

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

  toggle(index: number): ReturnType<typeof GSPClient['update']> {
    const {spreadsheetId} = this;
    const updateItemRow = this.getAbsoluteIndex(index);
    const updateRange = this.columnEnd + updateItemRow;
    return GSPClient.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[true]],
      },
    });
  }

  getAll(): Promise<ListItem[]> {
    const {spreadsheetId, range} = this;
    return GSPClient.read({spreadsheetId, range}).then(
      ({data: {values}}) =>
        values?.map((row) => {
          return {value: row[0], done: JSON.parse(row[1].toLowerCase())};
        }) || [],
    );
  }
}
