import { ITableItem, Table } from '../DocComponents';
import { ISettings } from '../lib';

export const splitTableBetweenPages = (
  table: ITableItem,
  remainingBodyHeight: number,
  bodyHeight: number,
  settings: ISettings
): ITableItem[] => {
  const [tablesOut] = table.rowHeights.reduce(
    (acc, rowHeight, i) => {
      const [tables, remainingHeight] = acc;
      const heightExceeded = rowHeight > remainingHeight;
      const newRemainingHeight = heightExceeded
        ? bodyHeight -
          rowHeight -
          ((table.headings && table.headingsHeight + table.headingsMargin) || 0)
        : remainingHeight - rowHeight;
      const activeTable = heightExceeded
        ? Table({ ...table, rowHeights: [rowHeight], content: [table.content[i]] })(settings)
        : Table({
            ...table,
            rowHeights: [...tables[tables.length - 1].rowHeights, rowHeight],
            content: [...tables[tables.length - 1].content, table.content[i]],
          })(settings);
      const newTablesList = heightExceeded
        ? [...tables, activeTable]
        : [...tables.slice(0, tables.length - 1), activeTable];
      return [newTablesList, newRemainingHeight];
    },
    [
      [Table({ ...table, rowHeights: [], content: [] })(settings)],
      remainingBodyHeight - ((table.headings && table.headingsHeight + table.headingsMargin) || 0),
    ]
  );
  return tablesOut;
};
