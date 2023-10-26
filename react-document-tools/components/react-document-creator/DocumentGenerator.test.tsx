import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { calculateBodyDimensions } from '@react-document-tools/utils.size-checks';
import {
  DocumentGenerator,
  IDocumentGeneratorProps,
} from './react-document-creator';

import { splitTableBetweenPages } from './utils/tableUtils';

import { addToPages, calculatePages } from './utils/processContent';

import { DEFAULT_SETTINGS, headingHeight } from './constants';
import { H1, Div, P, Img, Table, PageBreak, FullPage } from './DocComponents';
import {
  MOCK_BODY_HEIGHT,
  MOCK_JSON_PAGE,
  MOCK_OPTIONS,
  MOCK_PAGE_HEIGHT,
  MOCK_TABLE_BIG_EXAMPLE,
  MOCK_TABLE_COMPLEX_EXAMPLE,
  MOCK_TABLE_EXAMPLE,
} from './_mockComponents';
import { processBody } from './utils/helpers';
// import { EContentType, ITemplate } from './lib';
import { EContentType } from './lib';

// jest.mock(
//   '@samnbuk/react-document-tools.components.react-print-preview',
//   () => {
//     return {
//       PrintPreview: function ({ pages }) {
//         const pagesFlattened = pages;
//         return (
//           <div className="printPreview">
//             {pagesFlattened.map((page: any) => page.page)}
//           </div>
//         );
//       },
//       Page: class Page {
//         uid;
//         page;
//         constructor(uid, page) {
//           this.uid = uid;
//           this.page = page;
//         }
//       },
//     };
//   }
// );
// const mockSizeCheck = jest.createMockFromModule('@react-document-tools/utils.size-checks') as any;
// const mockDocumentCreateElement = jest.spyOn('document', 'createElement') as any;
// jest.mock('@react-document-tools/utils.size-checks', () => ({
//   ...jest.requireActual('@react-document-tools/utils.size-checks'),
//   getTextWidth: jest.fn().mockImplementation((...args) => {
//     mockDocumentCreateElement.mockReturnValueOnce({
//       getContext: () => {
//         return {
//           measureText: () => {
//             return { width: 100 };
//           },
//         };
//       },
//     });
//   }),
//   getTextHeight: jest.fn().mockImplementation(() => 100),
//   getPixelRatio: jest.fn().mockImplementation(() => 1),
// }));
jest.mock('@react-document-tools/utils.size-checks');
jest.mock('./utils/idGenerator', () => ({ getNextId: () => 'DEMOID' }));
Date.now = jest.fn().mockImplementation(() => 0);

const SETTINGS = {
  ...DEFAULT_SETTINGS,
  lineHeight: 85,
};

const defaultProps: IDocumentGeneratorProps = {
  settings: SETTINGS,
  data: {},
  template: MOCK_JSON_PAGE(),
};

// const altTemplate: ITemplate = {
//   body: {
//     content: [H1('Hardware Schedule')],
//   },
//   footer: () => ({content: []}),
//   header: () => ({
//     content: [
//       Table({
//         id: -95,
//         uid: 'alt template table',
//         columnWidths: [100, 50],
//         rowHeights: [100],
//         content: [['', Img('/images/logo.png', 30, 5, 'Logo')]],
//       }),
//     ],
//   }),
// };

describe('DocumentGenerator', () => {
  test('Renders', () => {
    render(<DocumentGenerator {...defaultProps} />);
  });
  describe('shallow renders', () => {
    test('Matches Snapshot', () => {
      const { baseElement } = render(<DocumentGenerator {...defaultProps} />);
      expect(baseElement).toMatchSnapshot();
    });
    // test('Matches Snapshot alt', () => {
    //   const { baseElement } = render(
    //     <DocumentGenerator {...defaultProps} template={altTemplate} />
    //   );
    //   expect(baseElement).toMatchSnapshot();
    // });
  });
  describe('Unit tests', () => {
    describe('Calculations', () => {
      describe('Calculate space available for main content', () => {
        test('should calculate the space available for main content', () => {
          const { width, height } = calculateBodyDimensions(MOCK_OPTIONS);
          expect(width).toEqual(190);
          expect(height).toEqual(217);
        });
      });

      describe('Page Breaks', () => {
        test('should split pages at page break', () => {
          const body = processBody(
            {
              content: [H1('Head'), P('Hello'), PageBreak(), P('World')],
              options: {},
            },
            SETTINGS
          );
          // TODO: Add page height to cal pages
          const [numberOfPages, , pageTemplates] = calculatePages(
            defaultProps.settings,
            defaultProps.data,
            processBody(body, SETTINGS),
            MOCK_BODY_HEIGHT,
            MOCK_PAGE_HEIGHT
          );
          expect(numberOfPages).toEqual(2);
          expect(pageTemplates).toMatchSnapshot();
        });
        test('should split pages at multiple page breaks', () => {
          const body = {
            content: [
              H1('Head'),
              P('Hello'),
              PageBreak(),
              P('World'),
              PageBreak(),
              P('World'),
            ],
            options: {},
          };
          const [numberOfPages, , pageTemplates] = calculatePages(
            defaultProps.settings,
            defaultProps.data,
            processBody(body, SETTINGS),
            MOCK_BODY_HEIGHT,
            MOCK_PAGE_HEIGHT
          );
          expect(numberOfPages).toEqual(3);
          expect(pageTemplates).toMatchSnapshot();
        });

        test('should split pages at page break sngle', () => {
          const body = {
            content: [P('Hello'), PageBreak(), P('World')],
            options: {},
          };
          const [numberOfPages, , pageTemplates] = calculatePages(
            defaultProps.settings,
            defaultProps.data,
            processBody(body, SETTINGS),
            MOCK_BODY_HEIGHT,
            MOCK_PAGE_HEIGHT
          );
          expect(numberOfPages).toEqual(2);
          expect(pageTemplates).toMatchSnapshot();
        });
      });
      describe('Handles full pages', () => {
        const template = {
          header: () => ({ content: [P('Header')] }),
          footer: () => ({ content: [P('Footer')] }),
          body: {
            // content: [P('Hello'), FullPage([P('Full page')])],
            content: [
              FullPage([P('Full page 1')], 'demoFullPage1'),
              P('Hello'),
              FullPage([P('Full page 2')], 'demoFullPage2'),
              PageBreak(),
              P('World'),
            ],
          },
        };
        test('should calculate correct number of pages when including full page', () => {
          const [numberOfPages, , pageTemplates] = calculatePages(
            defaultProps.settings,
            defaultProps.data,
            processBody(template.body, SETTINGS),
            MOCK_BODY_HEIGHT,
            MOCK_PAGE_HEIGHT
          );
          expect(numberOfPages).toEqual(4);
          expect(pageTemplates).toMatchSnapshot();
          expect(pageTemplates[0].map((o) => o.type)).toEqual([
            'p',
            'pagebreak',
          ]);
          expect(pageTemplates[1].map((o) => o.type)).toEqual([
            'p',
            'pagebreak',
          ]);
          expect(pageTemplates[2].map((o) => o.type)).toEqual([
            'p',
            'pagebreak',
          ]);
          expect(pageTemplates[3].map((o) => o.type)).toEqual(['p']);
        });
        test('should alter page options for full pages', () => {
          const [numberOfPages, , , pageOptions] = calculatePages(
            defaultProps.settings,
            defaultProps.data,
            processBody(template.body, SETTINGS),
            MOCK_BODY_HEIGHT,
            MOCK_PAGE_HEIGHT
          );
          expect(pageOptions.length).toEqual(4);
          expect(pageOptions.length).toEqual(numberOfPages);
          expect(pageOptions.map((o) => o.includeFooter)).toEqual([
            false,
            true,
            false,
            true,
          ]);
          expect(pageOptions.map((o) => o.includeHeader)).toEqual([
            false,
            true,
            false,
            true,
          ]);
          expect(pageOptions.map((o) => o.bodyHeight)).toEqual([
            MOCK_PAGE_HEIGHT,
            MOCK_BODY_HEIGHT,
            MOCK_PAGE_HEIGHT,
            MOCK_BODY_HEIGHT,
          ]);
        });
      });
      describe('Calculate pages', () => {
        test('should return a single page if small amount of content', () => {
          const body = {
            content: [H1('Head'), P('Hello'), P('World')],
            options: {},
          };
          const [numberOfPages] = calculatePages(
            defaultProps.settings,
            defaultProps.data,
            processBody(body, SETTINGS),
            MOCK_BODY_HEIGHT,
            MOCK_PAGE_HEIGHT
          );
          expect(numberOfPages).toEqual(1);
        });
        test('should return 2 pages if content exceeds single page height', () => {
          const body = {
            content: [
              H1('Head'),
              P('Hello'),
              P('World'),
              { type: 'section', height: 170 },
            ],
            options: {},
          };
          const [numberOfPages] = calculatePages(
            defaultProps.settings,
            defaultProps.data,
            processBody(body, SETTINGS),
            MOCK_BODY_HEIGHT,
            MOCK_PAGE_HEIGHT
          );
          expect(numberOfPages).toEqual(2);
        });
        test('should throw error if item is bigger than body', () => {
          const body = {
            content: [{ type: 'section', height: MOCK_BODY_HEIGHT + 100 }],
            options: {},
          };
          expect(() =>
            calculatePages(
              defaultProps.settings,
              defaultProps.data,
              processBody(body, SETTINGS),
              MOCK_BODY_HEIGHT,
              MOCK_PAGE_HEIGHT
            )
          ).toThrow();
        });
        test('should split template between pages', () => {
          const body = processBody(
            {
              content: [
                H1('Head'),
                P('Hello'),
                P('World'),
                { type: 'section', height: 160 },
              ],
              options: {},
            },
            SETTINGS
          );
          const [numberOfPages, , pageTemplates] = calculatePages(
            defaultProps.settings,
            defaultProps.data,
            body,
            MOCK_BODY_HEIGHT,
            MOCK_PAGE_HEIGHT
          );
          expect(numberOfPages).toEqual(2);
          expect(pageTemplates.length).toEqual(numberOfPages);
          expect(pageTemplates).toEqual([
            [...body.content.slice(0, 3)],
            [body.content[3]],
          ]);
        });
        test('should manage tables that span multiple pages', () => {
          const body = {
            content: [
              Table({
                uid: 'example table',
                id: 'example table',
                columnWidths: [10, 20],
                rowHeights: [200, 200, 200],
                content: [
                  ['a', 'aa'],
                  ['b', 'bb'],
                  ['c', 'cc'],
                ],
                headings: ['A', 'B'],
              }),
            ],
            options: {},
          };
          const [numberOfPages, , pageTemplates] = calculatePages(
            defaultProps.settings,
            defaultProps.data,
            processBody(body, SETTINGS),
            MOCK_BODY_HEIGHT,
            MOCK_PAGE_HEIGHT
          );
          expect(numberOfPages).toEqual(3);
          expect(pageTemplates.length).toEqual(numberOfPages);
          expect(pageTemplates).toMatchSnapshot();
        });
      });
      describe('addToPages', () => {
        const pageOptions = {
          includeHeader: true,
          includeFooter: true,
          bodyHeight: MOCK_BODY_HEIGHT,
        };

        test('should add to page templates', () => {
          const previousNumberOfPages = 1;
          const previousRemainingBodyHeight = MOCK_BODY_HEIGHT;
          const previousTemplate = [[]];
          const previousPageOptions = [pageOptions];
          const content = P('Hello')(SETTINGS);
          const [
            numberOfPages,
            remainingBodyHeight,
            currPageTemplates,
            allPageOptions,
          ] = addToPages(
            defaultProps.settings,
            defaultProps.data,
            content,
            MOCK_BODY_HEIGHT,
            [
              previousNumberOfPages,
              previousRemainingBodyHeight,
              previousTemplate,
              previousPageOptions,
            ]
          );
          expect(numberOfPages).toEqual(1);
          expect(remainingBodyHeight).toEqual(
            MOCK_BODY_HEIGHT - content.height
          );
          expect(currPageTemplates).toMatchSnapshot();
          expect(allPageOptions.length).toEqual(numberOfPages);
          expect(allPageOptions).toEqual([pageOptions]);
        });
        test('should add to page templates with overflow content', () => {
          const previousNumberOfPages = 1;
          const contentHeight = 100;
          const previousRemainingBodyHeight = contentHeight - 1;
          const previousTemplate = [[]];
          const previousPageOptions = [pageOptions];
          const [
            numberOfPages,
            remainingBodyHeight,
            currPageTemplates,
            allPageOptions,
          ] = addToPages(
            defaultProps.settings,
            defaultProps.data,
            {
              type: EContentType.SECTION,
              height: contentHeight,
              id: 'example section',
              uid: 9999,
            },
            MOCK_BODY_HEIGHT,
            [
              previousNumberOfPages,
              previousRemainingBodyHeight,
              previousTemplate,
              previousPageOptions,
            ]
          );
          expect(numberOfPages).toEqual(2);
          expect(remainingBodyHeight).toEqual(MOCK_BODY_HEIGHT - contentHeight);
          expect(currPageTemplates).toMatchSnapshot();

          expect(allPageOptions.length).toEqual(numberOfPages);
          expect(allPageOptions).toEqual([pageOptions, pageOptions]);
        });
        test('should add table to page templates', () => {
          const previousNumberOfPages = 1;
          const previousRemainingBodyHeight = MOCK_BODY_HEIGHT;
          const previousTemplate = [[]];
          const previousPageOptions = [];
          const [numberOfPages, remainingBodyHeight, currPageTemplates] =
            addToPages(
              defaultProps.settings,
              defaultProps.data,
              MOCK_TABLE_EXAMPLE()(SETTINGS),
              MOCK_BODY_HEIGHT,
              [
                previousNumberOfPages,
                previousRemainingBodyHeight,
                previousTemplate,
                previousPageOptions,
              ]
            );
          expect(numberOfPages).toEqual(1);
          expect(remainingBodyHeight).toEqual(
            MOCK_BODY_HEIGHT -
              50 -
              headingHeight -
              (SETTINGS.tableHeadingsMargin || 0)
          );
          expect(currPageTemplates).toMatchSnapshot();
        });
        test('should add page break correctly', () => {
          const previousNumberOfPages = 1;
          const pageBreakHeight = 100;
          const previousRemainingBodyHeight = pageBreakHeight;
          const previousTemplate = [[]];
          const previousPageOptions = [];
          const [numberOfPages, remainingBodyHeight, currPageTemplates] =
            addToPages(
              defaultProps.settings,
              defaultProps.data,
              {
                type: EContentType.PAGEBREAK,
                height: pageBreakHeight,
                id: 9999,
                uid: 99999,
              },
              MOCK_BODY_HEIGHT,
              [
                previousNumberOfPages,
                previousRemainingBodyHeight,
                previousTemplate,
                previousPageOptions,
              ]
            );
          expect(numberOfPages).toEqual(1);
          expect(remainingBodyHeight).toEqual(0);
          expect(currPageTemplates).toMatchSnapshot();
        });
        test('should add div correctly', () => {
          const previousNumberOfPages = 1;
          const previousRemainingBodyHeight = MOCK_BODY_HEIGHT;
          const previousTemplate = [[]];
          const previousPageOptions = [];
          const divHeight = 20;
          const [numberOfPages, remainingBodyHeight, currPageTemplates] =
            addToPages(
              defaultProps.settings,
              defaultProps.data,
              Div('hello', divHeight)(SETTINGS),
              MOCK_BODY_HEIGHT,
              [
                previousNumberOfPages,
                previousRemainingBodyHeight,
                previousTemplate,
                previousPageOptions,
              ]
            );
          expect(numberOfPages).toEqual(1);
          expect(remainingBodyHeight).toEqual(MOCK_BODY_HEIGHT - divHeight);
          expect(currPageTemplates).toMatchSnapshot();
        });
      });

      describe('Splitting Tables', () => {
        test('should not split table if smaller than remaining height', () => {
          const tables = splitTableBetweenPages(
            MOCK_TABLE_EXAMPLE()(SETTINGS),
            100,
            150,
            SETTINGS
          );
          expect(tables.length).toEqual(1);
          expect(tables).toMatchSnapshot();
        });
        test('should split table once if greater than remaining height', () => {
          const tables = splitTableBetweenPages(
            MOCK_TABLE_EXAMPLE()(SETTINGS),
            40,
            150,
            SETTINGS
          );
          expect(tables.length).toEqual(2);
          expect(tables).toMatchSnapshot();
        });
        test('should split a table between 3 pages if greater than remaining height plus full height', () => {
          const tables = splitTableBetweenPages(
            MOCK_TABLE_BIG_EXAMPLE()(SETTINGS),
            60,
            140,
            SETTINGS
          );
          expect(tables.length).toEqual(3);
          expect(tables).toMatchSnapshot();
        });
        test('should still have the same number of content', () => {
          const tables = splitTableBetweenPages(
            MOCK_TABLE_BIG_EXAMPLE()(SETTINGS),
            60,
            100,
            SETTINGS
          );
          expect(
            tables.map((t) => t.content.length).reduce((acc, v) => acc + v)
          ).toEqual(MOCK_TABLE_BIG_EXAMPLE()(SETTINGS).content.length);
        });
        test('should have added headings to each table', () => {
          const tables = splitTableBetweenPages(
            MOCK_TABLE_BIG_EXAMPLE()(SETTINGS),
            60,
            100,
            SETTINGS
          );
          expect(
            tables.every(
              // Need to join to compare as strings
              (t) =>
                t.headings?.join(' ') ===
                MOCK_TABLE_BIG_EXAMPLE()(SETTINGS).headings?.join(' ')
            )
          ).toEqual(true);
        });
        test('should not make the first table bigger than the page height', () => {
          const remainingHeight = 50;
          const tables = splitTableBetweenPages(
            MOCK_TABLE_BIG_EXAMPLE()(SETTINGS),
            remainingHeight,
            100,
            SETTINGS
          );
          expect(tables[0].height < remainingHeight).toEqual(true);
        });

        test('should have recalculated the heights of each table', () => {
          const tables = splitTableBetweenPages(
            MOCK_TABLE_BIG_EXAMPLE()(SETTINGS),
            60,
            100,
            SETTINGS
          );
          const heightCalculated = tables
            .map((t) => t.height)
            .reduce((acc, v) => acc + v)
            .toFixed(1);
          expect(heightCalculated).toEqual(
            (
              MOCK_TABLE_BIG_EXAMPLE()(SETTINGS).height +
              (tables.length - 1) *
                (headingHeight +
                  MOCK_TABLE_BIG_EXAMPLE()(SETTINGS).headingsMargin)
            ).toFixed(1)
          );
        });
        test('should work with calculate pages', () => {
          const [pageCount] = calculatePages(
            MOCK_OPTIONS,
            {},
            { content: [MOCK_TABLE_BIG_EXAMPLE()(SETTINGS)] },
            200,
            MOCK_PAGE_HEIGHT
          );
          expect(pageCount).toEqual(2);
        });
        test('should maintain all the props on the table', () => {
          const table = MOCK_TABLE_COMPLEX_EXAMPLE()(SETTINGS);
          const tables = splitTableBetweenPages(table, 100, 150, SETTINGS);
          expect(
            tables.every(
              (t) => Object.keys(t).join(' ') === Object.keys(table).join(' ')
            )
          ).toEqual(true);
          expect(tables).toMatchSnapshot();
        });
      });
    });
  });

  describe('Testability', () => {
    test('should be able to access sections with test ids', () => {
      render(<DocumentGenerator {...defaultProps} />);
      const pages = screen.getAllByTestId('docGen-page');
      expect(pages.length).toBeGreaterThan(1);
      expect(
        within(pages[0]).getByTestId('docGen-section-body')
      ).toBeInTheDocument();
    });
  });
});

// test('should handle edge case', () => {
//   const jsonData = [
//     {
//       uid: 206,
//       type: 'h1',
//       text: 'Product Summary',
//       height: 3.5999999999999996,
//       align: 'left',
//       style: {
//         height: '3.5999999999999996mm',
//         fontWeight: 'bold',
//         padding: 0,
//         margin: 0,
//       },
//       font: '4mm/3.5999999999999996mm Arial',
//     },
//     {
//       uid: 207,
//       type: 'p',
//       height: 2.533333333333333,
//       align: 'left',
//       style: {
//         padding: 0,
//         margin: 0,
//         whiteSpace: 'nowrap',
//         overflow: 'hidden',
//         textOverflow: 'ellipsis',
//       },
//       font: '100 3mm/2.533333333333333mm  Arial',
//     },
//     {
//       id: 'productsTable',
//       uid: 217,
//       type: 'table',
//       height: 25.2,
//       width: 190,
//       columnWidths: [164, 12, 14],
//       rowHeights: [4.533333333333333, 4.533333333333333, 4.533333333333333],
//       content: [
//         [
//           {
//             uid: 208,
//             type: 'div',
//             text: 'catalog-product-2',
//             height: 'auto',
//             width: 'auto',
//             align: 'left',
//             style: {
//               padding: 0,
//               margin: 0,
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//             },
//             font: '100 3mm/2.533333333333333mm  Arial',
//           },
//           {
//             uid: 209,
//             type: 'p',
//             text: '60',
//             height: 2.533333333333333,
//             align: 'center',
//             style: {
//               padding: 0,
//               margin: 0,
//               whiteSpace: 'nowrap',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//             },
//             font: '100 3mm/2.533333333333333mm  Arial',
//           },
//           {
//             uid: 210,
//             type: 'p',
//             text: 'pair',
//             height: 2.533333333333333,
//             align: 'left',
//             style: {
//               padding: 0,
//               margin: 0,
//               whiteSpace: 'nowrap',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//             },
//             font: '100 3mm/2.533333333333333mm  Arial',
//           },
//         ],
//         [
//           {
//             uid: 211,
//             type: 'div',
//             text: 'revision-product-2',
//             height: 'auto',
//             width: 'auto',
//             align: 'left',
//             style: {
//               padding: 0,
//               margin: 0,
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//             },
//             font: '100 3mm/2.533333333333333mm  Arial',
//           },
//           {
//             uid: 212,
//             type: 'p',
//             text: '20',
//             height: 2.533333333333333,
//             align: 'center',
//             style: {
//               padding: 0,
//               margin: 0,
//               whiteSpace: 'nowrap',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//             },
//             font: '100 3mm/2.533333333333333mm  Arial',
//           },
//           {
//             uid: 213,
//             type: 'p',
//             text: 'each',
//             height: 2.533333333333333,
//             align: 'left',
//             style: {
//               padding: 0,
//               margin: 0,
//               whiteSpace: 'nowrap',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//             },
//             font: '100 3mm/2.533333333333333mm  Arial',
//           },
//         ],
//         [
//           {
//             uid: 214,
//             type: 'div',
//             text: 'catalog-product-1',
//             height: 'auto',
//             width: 'auto',
//             align: 'left',
//             style: {
//               padding: 0,
//               margin: 0,
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//             },
//             font: '100 3mm/2.533333333333333mm  Arial',
//           },
//           {
//             uid: 215,
//             type: 'p',
//             text: '2',
//             height: 2.533333333333333,
//             align: 'center',
//             style: {
//               padding: 0,
//               margin: 0,
//               whiteSpace: 'nowrap',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//             },
//             font: '100 3mm/2.533333333333333mm  Arial',
//           },
//           {
//             uid: 216,
//             type: 'p',
//             text: 'pair',
//             height: 2.533333333333333,
//             align: 'left',
//             style: {
//               padding: 0,
//               margin: 0,
//               whiteSpace: 'nowrap',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//             },
//             font: '100 3mm/2.533333333333333mm  Arial',
//           },
//         ],
//       ],
//       headings: [
//         [
//           {
//             align: 'left',
//             font: '100 4mm/4.5mm  Arial',
//             height: 4.5,
//             style: {
//               margin: 0,
//               overflow: 'hidden',
//               padding: 0,
//               textOverflow: 'ellipsis',
//               whiteSpace: 'nowrap',
//             },
//             text: 'Product Code',
//             type: 'p',
//             uid: 2,
//           },
//         ],
//         'Qty',
//         'Unit',
//       ],
//       headingsHeight: 11.6,
//       cellPadding: 1,
//       font: '100 3mm/2.533333333333333mm  Arial',
//     },
//     {
//       uid: 218,
//       type: 'p',
//       height: 2.533333333333333,
//       align: 'left',
//       style: {
//         padding: 0,
//         margin: 0,
//         whiteSpace: 'nowrap',
//         overflow: 'hidden',
//         textOverflow: 'ellipsis',
//       },
//       font: '100 3mm/2.533333333333333mm  Arial',
//     },
//     {
//       uid: 219,
//       type: 'p',
//       height: 2.533333333333333,
//       align: 'left',
//       style: {
//         padding: 0,
//         margin: 0,
//         whiteSpace: 'nowrap',
//         overflow: 'hidden',
//         textOverflow: 'ellipsis',
//       },
//       font: '100 3mm/2.533333333333333mm  Arial',
//     },
//     {
//       uid: 220,
//       type: 'p',
//       height: 2.533333333333333,
//       align: 'left',
//       style: {
//         padding: 0,
//         margin: 0,
//         whiteSpace: 'nowrap',
//         overflow: 'hidden',
//         textOverflow: 'ellipsis',
//       },
//       font: '100 3mm/2.533333333333333mm  Arial',
//     },
//     {
//       uid: 221,
//       type: 'pagebreak',
//     },
//   ];
//   const content = jsonToDom({
//     body: {
//       content: jsonData,
//     },
//   });
//   mount(content);
// });
