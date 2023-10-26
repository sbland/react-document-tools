import { EFilterType } from '@react_db_client/constants.client-types';
import { DEFAULT_SETTINGS, lineHeight } from './constants';
import { B, Div, H, ITableItem, P, Table, TableCell } from './DocComponents';
import { ITemplateContentItem } from './lib';
import { processContent, processElement } from './utils/helpers';
import {
  MOCK_IMAGE_EXAMPLE,
  MOCK_HEADER,
  MOCK_SPAN,
  MOCK_PARAGRAPH,
  MOCK_PAGE_BREAK,
  MOCK_TABLE_EXAMPLE,
  MOCK_TABLE_BIG_EXAMPLE,
  MOCK_TABLE_COMPLEX_EXAMPLE,
  MOCK_TABLE_CALCULATE_EXAMPLE,
  MOCK_DIV,
  MOCK_HR,
  MOCK_BOLD,
  MOCK_CONTAINER,
  MOCK_EMBED,
  MOCK_FULL_PAGE,
} from './_mockComponents';

/* MOCKS */
jest.mock('@react-document-tools/utils.size-checks');
jest.mock('./utils/idGenerator', () => ({ getNextId: () => 'DEMOID' }));
// jest.mock('@react-document-tools/utils.size-checks', () => ({
//   ...jest.requireActual('@react-document-tools/utils.size-checks'),
//   getTextWidth: jest.fn().mockImplementation(
//     (txt, font) => {
//       const parsedFont = font ? parseFont(font) : {};
//       const { fontSize } = parsedFont as any;
//       const fontSizeParsed = fontSize ? parseFloat(fontSize.split('mm')[0]) : 99;
//       return txt ? fontSizeParsed * txt.length : 0;
//     }
//   ),
//   getTextHeight: jest.fn().mockImplementation(() => 1.6),
//   getPixelRatio: jest.fn().mockImplementation(() => 1),
// }));]


describe('DocComponents', () => {
  // let doc;
  // beforeAll(() => {
  //   doc = global.document;
  //   const mockContext = {
  //     measureText: jest
  //       .fn()
  //       .mockImplementation((text) => ({ width: text && text.length * charWidth, height: 99 })),
  //   };
  //   const mockElement = { getContext: jest.fn().mockImplementation(() => mockContext) };
  //   global.document.createElement = jest.fn().mockImplementation(() => mockElement);
  // });
  // afterAll(() => {
  //   global.document = doc;
  // });

  describe('Snapshots', () => {
    test('should generate mock container', () => {
      expect(MOCK_CONTAINER()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });
    test('should generate mock div', () => {
      expect(MOCK_DIV()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });
    test('should generate mock hr', () => {
      expect(MOCK_HR()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });
    test('should generate mock image', () => {
      expect(MOCK_IMAGE_EXAMPLE()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });
    test('should generate MOCK_HEADER', () => {
      expect(MOCK_HEADER()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });

    test('should generate MOCK_PARAGRAPH', () => {
      expect(MOCK_PARAGRAPH()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });

    test('should generate MOCK_SPAN', () => {
      expect(MOCK_SPAN()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });

    test('should generate MOCK_BOLD', () => {
      expect(MOCK_BOLD()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });

    test('should generate MOCK_PAGE_BREAK', () => {
      expect(MOCK_PAGE_BREAK()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });

    test('should generate MOCK_IMAGE_EXAMPLE', () => {
      expect(MOCK_IMAGE_EXAMPLE()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });

    test('should generate MOCK_TABLE_EXAMPLE', () => {
      expect(MOCK_TABLE_EXAMPLE()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });

    test('should generate MOCK_TABLE_BIG_EXAMPLE', () => {
      expect(MOCK_TABLE_BIG_EXAMPLE()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });

    test('should generate MOCK_TABLE_COMPLEX_EXAMPLE', () => {
      expect(MOCK_TABLE_COMPLEX_EXAMPLE()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });

    test('should generate MOCK_TABLE_CALCULATE_EXAMPLE', () => {
      expect(
        MOCK_TABLE_CALCULATE_EXAMPLE()(DEFAULT_SETTINGS)
      ).toMatchSnapshot();
    });

    test('should generate MOCK_EMBED', () => {
      expect(MOCK_EMBED()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });
    test('should generate MOCK_FULL_PAGE', () => {
      expect(MOCK_FULL_PAGE()(DEFAULT_SETTINGS)).toMatchSnapshot();
    });
  });
  describe('Edge Cases', () => {
    test.skip('should correctly size div', () => {
      // TODO: This is not working. We need to implement font size and line height from 10mm/10mm Arial
      let div;
      div = Div('Hello \n World', 'calculate', 100, {
        font: '10mm/10mm Arial',
      })(DEFAULT_SETTINGS);
      expect(div.height).toEqual(10 * 2);
      div = Div('Hello \n World', 'calculate', 100, { font: '5mm/5mm Arial' })(
        DEFAULT_SETTINGS
      );
      expect(div.height).toEqual(5 * 2);
      div = Div('Hello \n\n World', 'calculate', 100, {
        font: '5mm/5mm Arial',
      })(DEFAULT_SETTINGS);
      expect(div.height).toEqual(5 * 3);
    });
  });
  describe('Images', () => {
    test('should correctly size image', () => {
      const image = MOCK_IMAGE_EXAMPLE()(DEFAULT_SETTINGS);
      expect(image.width).toEqual(50);
      expect(image.height).toEqual(20);
    });
  });
  describe('Table', () => {
    describe('Calculated', () => {
      test('should calculate heading height correctly', () => {
        const rows = [
          { a: 'Foo', b: 'hello' },
          { a: 'Foo', b: 'hello' },
          { a: 'Foo', b: 'hello' },
        ];
        const headings = [
          // TODO: P is not creating a new line
          {
            uid: 'a',
            label: [B('Value'), P('(abc)')],
            type: EFilterType.textLong,
            width: 10,
          },
          { uid: 'b', label: B('b'), type: EFilterType.textLong, width: 10 },
        ];
        const cellPadding = 2;
        const table = Table({
          id: 'productsTable',
          uid: 1,
          columnWidths: 'calculate',
          rowHeights: 'calculate',
          content: rows.map((row) =>
            /* Note cell width and heights need to be auto as these are calculated */
            headings.map((h) =>
              TableCell(row[h.uid], 'auto', 'auto', h.type, cellPadding)
            )
          ),
          headings: headings.map((h) => Div(h.label, 'auto', 'auto')),
          cellPadding,
          headingsHeight: 'calculated',
          headingsMeta: headings,
          maxWidth: 190,
        });

        const processedContent = processElement(
          table,
          DEFAULT_SETTINGS
        ) as ITableItem;
        expect(processedContent).toMatchSnapshot();
        const expectedHeadingsHeight =
          DEFAULT_SETTINGS.lineHeight * 2 + cellPadding;
        expect(processedContent.headingsHeight).toEqual(expectedHeadingsHeight);
      });
      test('should calculate the width of a table correctly', () => {
        const cellPadding = 0;
        const items = [
          { a: 'Foo', b: 'hello' },
          { a: 'Foo', b: 'hello' },
          { a: 'Foo', b: 'hello' },
        ];
        const headings = [
          { uid: 'a', label: 'a', type: EFilterType.textLong, width: 10 },
          { uid: 'b', label: 'b', type: EFilterType.textLong, width: 10 },
        ];
        const table = Table({
          uid: 'table',
          id: 1,
          columnWidths: 'calculate', // headings.map((h) => h.width || 30),
          rowHeights: 'calculate',
          content: items.map((item) =>
            headings.map((h) =>
              TableCell(item[h.uid], 'auto', 'auto', h.type, cellPadding)
            )
          ),
          headingsMeta: headings,
          headings: headings.map((h) => H(h.label, 3)),
          headingsHeight: 'calculated',
          cellPadding,
          maxWidth: 100,
        })(DEFAULT_SETTINGS);
        expect(table).toMatchSnapshot();
        expect(table.columnWidths).toEqual([50, 50]);
        expect(table.rowHeights).toEqual([lineHeight, lineHeight, lineHeight]);
        expect((table.content[0][0] as ITemplateContentItem).width).toEqual(
          'auto'
        );
      });
    });
    describe('Headings', () => {
      test('should render headings labels', () => {
        const cellPadding = 0;
        const items = [
          { a: 'Foo', b: 'hello' },
          { a: 'Foo', b: 'hello' },
          { a: 'Foo', b: 'hello' },
        ];
        const headings = [
          {
            uid: 'a',
            label: ['a', 'aa'],
            type: EFilterType.textLong,
            width: 10,
          },
          {
            uid: 'b',
            label: [P('b'), 'b', P('b')],
            type: EFilterType.textLong,
            width: 10,
          },
        ];
        const table = Table({
          uid: 'table',
          id: 1,
          columnWidths: 'calculate', // headings.map((h) => h.width || 30),
          rowHeights: 'calculate',
          content: items.map((item) =>
            headings.map((h) =>
              TableCell(item[h.uid], 'auto', 'auto', 'mixed', cellPadding)
            )
          ),
          headingsMeta: headings,
          headings: headings.map((h) => Div(h.label, 'auto', 3)),
          headingsHeight: 'calculated',
          cellPadding,
          maxWidth: 100,
        })(DEFAULT_SETTINGS);
        const processedContent = processContent([table], DEFAULT_SETTINGS);
        expect(processedContent).toMatchSnapshot();
      });
    });
  });
});
