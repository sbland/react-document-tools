/* Mock components for testing */

import { EFilterType } from '@react_db_client/constants.client-types';
import { styleDefaults } from './ComponentStyles';
import { DEFAULT_SETTINGS } from './constants';
import {
  H1,
  H,
  Section,
  Span,
  P,
  Div,
  Img,
  Table,
  PageBreak,
  Hr,
  TableCell,
  B,
  Container,
  Embed,
  FullPage,
} from './DocComponents';
import { EEmbedType } from './DocComponents/Embed';
import { EContentType, ISettings, ITemplate } from './lib';

export const MOCK_DIV = () => Div('Hello World', 100, 20);
export const MOCK_DIV_WITH_CHILDREN = () => Div(P('Hello World'), 100, 20);
export const MOCK_DIV_CENTER = () =>
  Div('Hello World', 100, 20, { align: 'center' });
export const MOCK_CONTAINER = () => Container('Hello World', 100, 20);
export const MOCK_HR = () => Hr(10, 20);
export const MOCK_HEADER = () => H('demo header', 3);
export const MOCK_SPAN = () => Span('demo span');
export const MOCK_PARAGRAPH = () => P('demo paragraph');
export const MOCK_BOLD = () => B('demo bold text');
export const MOCK_PAGE_BREAK = () => PageBreak();

export const MOCK_IMAGE_EXAMPLE = () =>
  Img('/images/logo.png', 50, 20, 'Demo Img');
export const MOCK_TABLE_EXAMPLE = () =>
  Table({
    uid: -99,
    id: 'Demo Table',
    columnWidths: [20, 30, 30, 60],
    rowHeights: [20, 30],
    content: [
      ['Hello', 'World', 'This', 'Is some information'],
      ['Another', 'Place', 'This', 'Is some information'],
    ],
    headings: ['NAME', 'PLACE', 'INFO', 'DESCRIPTION'],
  });

export const MOCK_TABLE_BIG_EXAMPLE = () =>
  Table({
    uid: -98,
    id: 'Demo Table Big',
    columnWidths: [20, 30, 30, 60],
    rowHeights: [20, 30, 90, 60, 10],
    content: [
      ['Hello', 'World', 'This', 'Is some information'],
      ['Another', 'World', 'This', 'Is some information'],
      ['Another', 'Place', 'This', 'Is some information'],
      ['Another', 'Place', 'This', 'Is some information'],
      ['Another', 'Land', 'This', 'Is some information'],
    ],
    headings: ['NAME', 'PLACE', 'INFO', 'DESCRIPTION'],
    headingsMargin: 10,
  });

export const longText = [
  ' This is some really long text',
  'and more text that should overflow',
].join(' ');

export const longTextB =
  'Consort CBH102 102x76x3mm Grade 304 SSS Finish Ball Bearing Butt Hinge, Load Bearing Capacity Up To 120kg and Durability Tested To Over 200,000 Cycles. Tested to BS EN 1935:2002, Grade 13 (Classification Code 4.7.6.1.1.4.0.13). Fire Door Approved: Suitable for use on up to FD120 Timber and FD240 Metal Door and Frame Applications. Certifire Warrington Certificate of Approval No. CF5511';

const items = [{ a: 'a', b: 'b', c: 10, d: { filePath: 'd.jpg' } }];

const headings = [
  { type: EFilterType.text, uid: 'a', width: 30 },
  { type: EFilterType.textLong, uid: 'b', width: 30 },
  { type: EFilterType.number, uid: 'c', width: 30 },
  { type: EFilterType.image, uid: 'd', width: 50, height: 30 },
];
export const MOCK_TABLE_CALCULATE_EXAMPLE = () =>
  Table({
    // 'calculate',
    uid: 97,
    id: 'Calulate Table',
    columnWidths: [20, 40, 40, 30],
    rowHeights: 'calculate',
    content: [
      ['Hello', 'World', Div(longText), Div('Is some information')],
      ['Another', 'World', 'This', Div('boxed content', 50)],
      ...items.map((item) =>
        headings.map((h) =>
          TableCell(item[h.uid], h.width, h.height || 'auto', h.type, 3)
        )
      ),
    ],
    headings: ['NAME', 'PLACE', 'INFO', 'DESCRIPTION'],
    cellPadding: 3,
  });

export const MOCK_TABLE_COMPLEX_EXAMPLE = () =>
  Table({
    id: 'Complex table',
    uid: 96,
    columnWidths: [20, 30, 30, 60],
    rowHeights: [20, 30],
    content: [
      ['Hello', 'World', 'This', MOCK_IMAGE_EXAMPLE()],
      ['Hello', 'World', 'This', MOCK_IMAGE_EXAMPLE()],
    ],
    headings: ['NAME', 'PLACE', 'INFO', 'DESCRIPTION'],
    headingsHeight: 30,
    cellPadding: 3,
  });

  const multiLineText = `Row 1
  Row 2

  After break
  More text

  \n\n\n\n

  `;


const longMultiLineText = `Row 1
Row 2

After break
More text

\n\n\n\nMore text

\n\n\n\nMore text

\n\n\n\nMore text

\n\n\n\nMore text

\n\n\n\nMore text

\n\n\n\nMore text

\n\n\n\n

`;


export const MOCK_JSON_PAGE = (): ITemplate => ({
  header: ({ date, pageNo, pageCount }) => ({
    content: [H1('Header'), P(date), P(String(pageNo)), P(String(pageCount))],
    options: {},
  }),
  body: {
    content: [
      H1('Head'),
      P('Hello'),
      Div(multiLineText, "calculate", 100),
      Div(longMultiLineText, "calculate", 100),
      Section([P('child 1')]),
      MOCK_IMAGE_EXAMPLE(),
      MOCK_TABLE_EXAMPLE(),
      MOCK_TABLE_CALCULATE_EXAMPLE(),
    ],
    options: {},
  },
  footer: ({ date, pageNo, pageCount }) => ({
    content: [H1('Footer'), P(date), P(String(pageNo)), P(String(pageCount))],
    options: {},
  }),
  type: EContentType.SECTION,
});

export const MOCK_EMBED = () =>
  Embed('demo_embed', 'demofile.pdf', EEmbedType.PDF, 100, 200);
export const MOCK_FULL_PAGE = () => FullPage([P('Hello')], 'example mock page');

export const MOCK_OPTIONS: ISettings = {
  ...DEFAULT_SETTINGS,
  paperHeight: 297,
  paperWidth: 210,
  headerHeight: 30,
  footerHeight: 30,
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 10,
  marginRight: 10,
  styleOverrides: styleDefaults(
    DEFAULT_SETTINGS.fontWeight,
    DEFAULT_SETTINGS.textHeight,
    DEFAULT_SETTINGS.lineHeight,
    DEFAULT_SETTINGS.fontFamily,
    DEFAULT_SETTINGS.headingHeight
  ),
};

export const MOCK_BODY_HEIGHT =
  DEFAULT_SETTINGS.internalHeight -
  DEFAULT_SETTINGS.headerHeight -
  DEFAULT_SETTINGS.footerHeight;
export const MOCK_PAGE_HEIGHT = DEFAULT_SETTINGS.paperHeight;
