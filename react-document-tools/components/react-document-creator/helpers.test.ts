import {
  defaultFont,
  DEFAULT_SETTINGS,
  lineHeight,
  maxRowHeight,
  minRowHeight,
} from './constants';
import { IBItem, IDivItem, IPItem, P, TableCell } from './DocComponents';
import {
  calculateCellHeight,
  calculateCellHeightMultiType,
  calculateTableColumnWidths,
  calculateTableRowHeight,
  calculateTableRowHeights,
} from './utils/calculateCellSize';
import { processElement } from './utils/helpers';
import { longText, longTextB } from './_mockComponents';
import { EContentType } from './lib';

jest.mock('@react-document-tools/utils.size-checks');

describe('Calculate Row Heights', () => {
  describe('Calculate Table Row Heights', () => {
    const font = defaultFont;
    test('should use minimum row height', () => {
      const content = [['a', 'b', 'c']];
      const rowHeights = calculateTableRowHeights(
        content,
        [10, 10, 10],
        0,
        font,
        DEFAULT_SETTINGS
      );
      expect(rowHeights).toEqual([minRowHeight]);
    });
    test('should use maximum row height', () => {
      const content = [
        ['a', 'b', `${longText}${longText}${longText}${longText}${longText}`],
      ];
      const rowHeights = calculateTableRowHeights(
        content,
        [60, 60, 10],
        0,
        font,
        DEFAULT_SETTINGS
      );
      expect(rowHeights).toEqual([maxRowHeight]);
    });
    test('should Calculate the row height based on the height of the tallest cell', () => {
      const content = ['a', 'b', longText];
      const rowHeight = calculateTableRowHeight(
        content,
        [20, 20, 20],
        0,
        font,
        DEFAULT_SETTINGS
      );
      const expectedLineCount = 12;
      expect(rowHeight).toEqual(lineHeight * expectedLineCount);
    });
    test('should implement padding in height calculation', () => {
      const content = ['a', 'b', longText];
      const padding = 3;
      const rowHeight = calculateTableRowHeight(
        content,
        [20, 20, 20],
        padding,
        font,
        DEFAULT_SETTINGS
      );
      const expectedLineCount = 13;
      expect(rowHeight).toEqual(lineHeight * expectedLineCount + padding);
    });
    test('should use height field if supplied', () => {
      const content = ['a', 'b', { text: 'abc', height: 90 }];
      const rowHeight = calculateTableRowHeight(
        content,
        [10, 10, 10],
        0,
        font,
        DEFAULT_SETTINGS
      );
      expect(rowHeight).toEqual(90);
    });

    test('should Calculate the row height based on the height of the tallest cell real world example', () => {
      const content = ['a', 'b', longText];
      const rowHeight = calculateTableRowHeight(
        content,
        [20, 20, 58],
        0,
        font,
        DEFAULT_SETTINGS
      );
      expect(rowHeight).toBeGreaterThan(lineHeight * 1);
    });
  });

  describe('Calculate Cell Height Multi', () => {
    test('should calculate cell height', () => {
      const cellData: IDivItem = {
        id: 'DEMOID',
        uid: 'DEMOID',
        type: EContentType.DIV,
        content: [
          {
            uid: 'DEMOID',
            type: EContentType.B,
            text: 'Value',
            height: 4.5,
            align: 'left',
            style: {
              padding: 0,
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: 'bold',
            },
            font: '100 4mm/4.5mm  Arial',
          } as IBItem,
          {
            uid: 'DEMOID',
            type: EContentType.P,
            text: '(abc)',
            height: 4.5,
            align: 'left',
            style: {
              padding: 0,
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            font: '100 4mm/4.5mm  Arial',
          } as IPItem,
        ],
        height: 'auto',
        width: 'auto',
        align: 'left',
        style: {
          padding: 0,
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        font: '100 4mm/4.5mm  Arial',
      };
      const columnWidth = 95;
      const cellPadding = 4;
      const font = '5mm/4.56mm Arial';
      const expectedHeight = 4.5 + 4.5 + cellPadding;
      const calculatedHeight = calculateCellHeightMultiType(
        cellData,
        columnWidth,
        cellPadding,
        font
      );
      expect(calculatedHeight).toEqual(expectedHeight);
    });
  });
  describe('Calculate Cell Height', () => {
    const font = defaultFont;
    test('single row should be half size of 2 rows', () => {
      const width = 25;
      const text = 'hello';
      const height = calculateCellHeight(text, width, font);

      const textB = 'hello world';
      const heightB = calculateCellHeight(textB, width, font);
      expect(height * 2).toEqual(heightB);
    });
    test('should increase height with line height increase', () => {
      const width = 100;
      const text = longTextB;
      const fontA = '100 4mm/4mm Arial';
      const height = calculateCellHeight(text, width, fontA, 1, 4);

      const fontB = '100 4mm/8mm Arial';
      const textB = longTextB;
      const heightB = calculateCellHeight(textB, width, fontB, 1, 8);
      expect(heightB).toBeGreaterThan(height);
    });

    test('should calculate cell height from text', () => {
      const cellHeight = calculateCellHeight(
        'abcdef',
        400,
        font,
        1,
        lineHeight
      );
      expect(cellHeight).toEqual(lineHeight * 1);
      expect(cellHeight % lineHeight).toEqual(0);
    });
    test('should calculate cell height from empty', () => {
      const cellHeight = calculateCellHeight('', 400, font, 1, lineHeight);
      expect(cellHeight).toEqual(lineHeight * 1);
      expect(cellHeight % lineHeight).toEqual(0);
    });
    test('should calculate cell height from long text', () => {
      const cellHeight = calculateCellHeight(
        `${longText}${longText}`,
        250,
        font,
        1,
        lineHeight
      );
      expect(cellHeight / lineHeight).toBeGreaterThan(1);
      expect(cellHeight % lineHeight).toEqual(0);
    });
    test('should calculate cell height from long text overflow', () => {
      const cellHeight = calculateCellHeight(
        `${longText}${longText}`,
        200,
        font,
        1,
        lineHeight
      );
      expect(cellHeight / lineHeight).toBeGreaterThan(1);
      expect(cellHeight % lineHeight).toEqual(0);
    });

    test('should strip out empty space at start and end', () => {
      const cellHeight = calculateCellHeight(
        `\ndef\n`,
        120,
        font,
        1,
        lineHeight
      );
      expect(cellHeight).toEqual(lineHeight * 1);
      expect(cellHeight % lineHeight).toEqual(0);
    });

    test('should strip out empty space at start and end with extra spaces', () => {
      const cellHeight = calculateCellHeight(
        `\ndef\n  \n`,
        120,
        font,
        1,
        lineHeight
      );
      expect(cellHeight).toEqual(lineHeight * 1);
      expect(cellHeight % lineHeight).toEqual(0);
    });
    test('should manage new line characters', () => {
      const cellHeight = calculateCellHeight(
        `abc\n\n\n def`,
        120,
        font,
        1,
        lineHeight
      );
      const lineCount = 4;
      expect(cellHeight).toEqual(lineHeight * lineCount);
      expect(cellHeight % lineHeight).toEqual(0);
    });

    test('should manage new line characters plus overflow', () => {
      const cellHeight = calculateCellHeight(
        `${longText}\n${longText}`,
        200,
        font,
        1,
        lineHeight
      );
      const lineCount = 4;
      expect(cellHeight).toEqual(lineHeight * lineCount);
      expect(cellHeight % lineHeight).toEqual(0);
    });

    test('should result in row height that is a multiple of line height', () => {
      const cellHeight = calculateCellHeight(longText, 60, font, 1, lineHeight);
      const lineCount = 6;
      expect(cellHeight).toEqual(lineHeight * lineCount);
      expect(cellHeight % lineHeight).toEqual(0);
      const cellHeightb = calculateCellHeight(
        longText,
        59,
        font,
        1,
        lineHeight
      );
      expect(cellHeightb).toEqual(lineHeight * lineCount);
      expect(cellHeightb % lineHeight).toEqual(0);
    });
    test('should work with RW example', () => {
      const text =
        '\nSome really long info about something that could be interesting and\nneeds to span lots of lines etc\n';
      const lineCount = 3;
      const width = 72;
      const pixelRatio = 3.76562;
      const cellPadding = 1;

      const cellHeight = calculateCellHeight(
        text,
        width - cellPadding,
        font,
        pixelRatio
      );
      const expectedHeight = (lineHeight * lineCount) / pixelRatio;
      expect(cellHeight).toEqual(expectedHeight);
      expect(expectedHeight % (lineHeight / pixelRatio)).toEqual(0);
    });
    describe('2 x pixel ratio', () => {
      const pixelRatio = 2;
      test('should calculate cell height from text', () => {
        const cellHeight = calculateCellHeight(
          'abcdef',
          400,
          font,
          pixelRatio,
          lineHeight
        );
        expect(cellHeight).toEqual((1 / pixelRatio) * lineHeight * 1);
        expect(cellHeight % (lineHeight / pixelRatio)).toEqual(0);
      });
      test('should calculate cell height from empty', () => {
        const cellHeight = calculateCellHeight(
          '',
          400,
          font,
          pixelRatio,
          lineHeight
        );
        expect(cellHeight).toEqual((1 / pixelRatio) * lineHeight * 1);
        expect(cellHeight % (lineHeight / pixelRatio)).toEqual(0);
      });
      test('should calculate cell height from long text', () => {
        const cellHeight = calculateCellHeight(
          `${longText}${longText}`,
          250,
          font,
          pixelRatio,
          lineHeight
        );
        const lineCount = 2;

        expect(cellHeight).toEqual((1 / pixelRatio) * lineHeight * lineCount);
        expect(cellHeight % (lineHeight / pixelRatio)).toEqual(0);
      });
    });
  });
});

describe('Calculate table column widths', () => {
  test('should fill table columns to table width using expand headers', () => {
    const tableWidth = 100;
    const headings = [
      {
        uid: 'h1',
        width: 20,
      },
      {
        uid: 'h2',
        width: 30,
        expand: true,
      },
      {
        uid: 'h2',
        width: 40,
      },
    ];
    const content = [['a', 'b', 'c']];
    const columnWidths = calculateTableColumnWidths(
      content,
      headings,
      tableWidth
    );
    expect(columnWidths).toEqual([20, 40, 40]);
    const calculatedTotalColumnsWidth = columnWidths.reduce(
      (acc, v) => acc + v,
      0
    );

    expect(calculatedTotalColumnsWidth).toEqual(tableWidth);
  });
  test('should fill table columns to table width with all headers if none set to expand', () => {
    const tableWidth = 100;
    const headings = [
      {
        uid: 'h1',
        width: 20,
      },
      {
        uid: 'h2',
        width: 37,
      },
      {
        uid: 'h2',
        width: 40,
      },
    ];
    const content = [['a', 'b', 'c']];
    const columnWidths = calculateTableColumnWidths(
      content,
      headings,
      tableWidth
    );
    expect(columnWidths).toEqual([21, 38, 41]);
    const calculatedTotalColumnsWidth = columnWidths.reduce(
      (acc, v) => acc + v,
      0
    );

    expect(calculatedTotalColumnsWidth).toEqual(tableWidth);
  });
});

describe('Process Element', () => {
  test('should process P', () => {
    const el = P('hello');
    const processedElement = processElement(el, DEFAULT_SETTINGS);
    expect(processedElement).toMatchSnapshot();
    expect(processedElement.text).toEqual('hello');
  });
  test('should not process Array', () => {
    // const el: ElementTypes[] = [P('hello'), P('world')];
    // TODO: Should not work
    // const processedElement = processElement(el, DEFAULT_SETTINGS);
    // expect(processedElement).toMatchSnapshot();
    // expect(processedElement[0].text).toEqual('hello');
  });
  test('should process table cell', () => {
    const el = TableCell('content', 'auto', 'auto', 'mixed', 2);
    const processedElement = processElement(el, DEFAULT_SETTINGS);
    expect(processedElement).toMatchSnapshot();
  });
  test('should process table cell with P', () => {
    const el = TableCell([P('content')], 'auto', 'auto', 'mixed', 2);
    const processedElement = processElement(el, DEFAULT_SETTINGS);
    expect(processedElement).toMatchSnapshot();
  });
});
