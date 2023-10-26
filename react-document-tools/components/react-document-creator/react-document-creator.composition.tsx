import React, { useState } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { getPixelRatio, getTextAreaSize } from '@react-document-tools/utils.size-checks';
import { DocumentGenerator } from './react-document-creator';
import {
  MOCK_FULL_PAGE,
  MOCK_JSON_PAGE,
  MOCK_TABLE_BIG_EXAMPLE,
  MOCK_TABLE_CALCULATE_EXAMPLE,
  MOCK_TABLE_COMPLEX_EXAMPLE,
} from './_mockComponents';

import { H1, P, Img, Table, PageBreak, Div } from './DocComponents';
import { jsonToDom, objToDom } from './Converters/domConverter';
import { DEFAULT_SETTINGS } from './constants';
// import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { calculateCellHeight } from './utils/calculateCellSize';
// import { ThemeProviders } from '../../providers';

// TODO: Bring across ThemeProviders
const ThemeProviders = ({ children }) => children;
// TODO: Bring across ErrorBoundary
const ErrorBoundary = ({ children }) => children;

const SETTINGS = {
  ...DEFAULT_SETTINGS,
  paperHeight: 296,
  paperWidth: 210,
  headerHeight: 30,
  footerHeight: 30,
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 10,
  marginRight: 10,
};

const ShowDom = ({ contentString }) => {
  const jsonData = JSON.parse(contentString);
  const content = jsonToDom(
    {
      body: {
        content: jsonData,
      },
    },
    99,
    DEFAULT_SETTINGS,
    DEFAULT_SETTINGS
  );
  return <>{content}</>;
};

export const Default = () => (
  <ThemeProviders>
    <DocumentGenerator
      settings={SETTINGS}
      data={{}}
      template={MOCK_JSON_PAGE()}
    />
  </ThemeProviders>
);
export const complex_table = () =>
  objToDom(MOCK_TABLE_COMPLEX_EXAMPLE()(DEFAULT_SETTINGS), DEFAULT_SETTINGS);

export const calculatedTable = () => (
  <div style={{ background: 'white' }}>
    {objToDom(
      MOCK_TABLE_CALCULATE_EXAMPLE()(DEFAULT_SETTINGS),
      DEFAULT_SETTINGS
    )}
  </div>
);
export const splitTables = () => (
  <DocumentGenerator
    settings={SETTINGS}
    data={{}}
    template={{
      ...MOCK_JSON_PAGE(),
      body: { content: [MOCK_TABLE_BIG_EXAMPLE()] },
    }}
  />
);
export const exampleReport = () => {
  const template = {
    body: {
      content: [
        H1('Hardware Schedule'),
        Table({
          id: '1',
          uid: 1,
          columnWidths: [95, 30, 65],
          rowHeights: [60, 60],
          content: [
            [
              Table({
                id: '2',
                uid: 2,
                columnWidths: [95],
                rowHeights: [10, 10, 10],
                content: [['Jasper Barnes'], ['AGCF'], ['Building 8']],
              }),
              P('Date:'),
              P('Saturday, September 9, 2020'),
            ],
            [P('Jasper Barnes'), P('Date:'), P('Saturday, September 9, 2020')],
          ],
        }),
        PageBreak(),
        H1('Hardware Schedule'),
        Div('hello', 30, 160, { align: 'center' }),
      ],
    },
    header: () => ({
      content: [
        Table({
          id: '3',
          uid: 3,
          columnWidths: [130, 60],
          rowHeights: [10],
          content: [['', Img('/images/logo.png', 60, 10, 'Logo')]],
        }),
      ],
    }),
  };
  return (
    <>
      {JSON.stringify(template.body.content)}
      <DocumentGenerator settings={SETTINGS} data={{}} template={template} />
    </>
  );
};
export const textCheck = () => {
  const texts = [
    `gggggggg ddddddddd gggggggg ddddddddd gggggggg gggggggg `,
    `gggggggg ddddddddd gggggggg  `,
    Array(5)
      .fill(0)
      .map(() => `gggggggg ddddddddd gggggggg  `)
      .join(' '),
    Array(20)
      .fill(0)
      .map(() => `gggggggg ddddddddd gggggggg  `)
      .join(' '),
  ].map((t) => {
    const dom = t
      .trim()
      .split('\n')
      .map((text) =>
        Div(text, 'calculate', 220, {
          style: { border: '0.1px solid red' },
        })(SETTINGS)
      )
      .map((o) => objToDom(o, SETTINGS));
    return <div style={{}}>{dom}</div>;
  });
  return <div className="">{texts}</div>;
};

export const CellHeight = () => {
  const [width, setWidth] = useState(100);
  const [font, setFont] = useState(DEFAULT_SETTINGS.defaultFont);
  const [val, setVal] = useState(
    'Hello this is sometext, Hello this is sometext Hello this is sometext'
  );
  const [multiplier, setMultiplier] = useState(1);
  const actualText = val.repeat(multiplier);
  // TODO: Add padding
  const height = calculateCellHeight(
    actualText,
    width,
    font,
    undefined,
    undefined
  );
  const pixelRatio = getPixelRatio();
  const lineHeightRaw = getTextAreaSize('hello', font).height;
  // const lineHeightRaw = parseFloat(font); // getTextAreaSize('hello', font).height;
  const lineHeight = '5.0mm'; // getTextAreaSize('hello', font).height / pixelRatio;
  const textStyle = {
    width: `${width}mm`,
    height: `${height}mm`,
    lineHeight: `${lineHeight}mm`,
    outline: '1px solid red',
    padding: 0,
    margin: 0,
    font,
    overflow: 'hidden',
  };
  const cellStyle = {
    width: `${width}mm`,
    height: `${height}mm`,
    // lineHeight: `${lineHeight}mm`,
    outline: '1px solid red',
    padding: 0,
    margin: 0,
  };
  const innerStyle = {
    font,
    height: 'auto',
    width: 'auto',
    textAlign: 'left',
    padding: '0px',
    margin: '0px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
  return (
    <div className="" style={{ background: 'white', height: '400px' }}>
      Width
      <input
        type="number"
        name="width"
        onChange={(e) => setWidth(parseFloat(e.target.value))}
        value={width}
      />
      Multiplier
      <input
        type="number"
        name="mult"
        onChange={(e) => setMultiplier(parseFloat(e.target.value))}
        value={multiplier}
      />
      Font
      <input
        type="text"
        name="font"
        onChange={(e) => setFont(e.target.value)}
        value={font}
      />
      {/*  */}
      <p>height: {height}</p>
      <p>width: {width}</p>
      <p>pixelRatio: {pixelRatio} </p>
      <p>lineHeight: {lineHeight} </p>
      <p>lineHeightRaw: {lineHeightRaw} </p>
      <div className="">
        <textarea
          name="abc"
          onChange={(e) => setVal(e.target.value)}
          value={val}
          style={textStyle}
        />
      </div>
      <div style={cellStyle}>
        <div style={innerStyle as any}>{actualText}</div>
      </div>
    </div>
  );
};
export const textEstimation = () => {
  const [val, setVal] = useState('Hello this is sometext');
  const getTextAreaSizeB = (txt, font) => {
    const element = document.createElement('canvas');
    const context = element.getContext('2d') as CanvasRenderingContext2D;
    context.font = font;
    const tsize = {
      width: context.measureText(txt).width,
      height: parseInt(context.font, 10),
    };
    return tsize;
  };
  const { width, height } = getTextAreaSizeB(val, '10px Arial');

  return (
    <div className="" style={{ background: 'white', height: '400px' }}>
      Hello
      {/*  */}
      <textarea
        name="abc"
        onChange={(e) => setVal(e.target.value)}
        value={val}
      />
      <p>height: {height}</p>
      <p>width: {width}</p>
      <div
        style={{
          width,
          height: `${height}px`,
          lineHeight: `${height}px`,
          outline: '1px solid red',
        }}
      >
        <div
          style={{
            font: 'Arial',
            fontSize: '10px',
            lineHeight: `${height}px`,
          }}
        >
          {val}
        </div>
      </div>
    </div>
  );
};
export const textEstimationToMm = () => {
  const [val, setVal] = useState('Hello this is sometext');
  const getTextAreaSizeB = (txt, font) => {
    const element = document.createElement('canvas');
    const context = element.getContext('2d') as CanvasRenderingContext2D;
    context.font = font;
    const tsize = {
      width: context.measureText(txt).width,
      height: parseInt(context.font, 10),
    };
    return tsize;
  };
  const getPixelRatio = () => {
    const x = '1mm';
    const div = document.createElement('div') as HTMLDivElement;
    div.style.display = 'block';
    div.style.height = x;
    document.body.appendChild(div);
    const px = parseFloat(window.getComputedStyle(div, null).height);
    div.parentNode?.removeChild(div);
    return px;
  };
  const pixelRatio = getPixelRatio();
  const { width, height } = getTextAreaSizeB(val, '4mm Arial');
  // const height

  return (
    <div className="" style={{ background: 'white', height: '400px' }}>
      Hello
      {/*  */}
      <textarea
        name="abc"
        onChange={(e) => setVal(e.target.value)}
        value={val}
      />
      <p>height: {height}</p>
      <p>width: {width}</p>
      <div
        style={{
          width,
          height: `${height}px`,
          lineHeight: `${height}px`,
          outline: '1px solid red',
        }}
      >
        <div
          style={{
            font: 'Arial',
            fontSize: '4mm',
            lineHeight: `${height}px`,
          }}
        >
          {val}
        </div>
      </div>
      <div
        style={{
          width,
          height: `${height / pixelRatio}mm`,
          lineHeight: `${height / pixelRatio}mm`,
          outline: '1px solid red',
        }}
      >
        <div
          style={{
            font: 'Arial',
            fontSize: '4mm',
            lineHeight: `${height / pixelRatio}mm`,
          }}
        >
          {val}
        </div>
      </div>
    </div>
  );
};
export const TextEstimationCellToMm = () => {
  const [val, setVal] = useState('Initial text fill area with overflow');
  const width = 80; // mm

  const getPixelRatio = () => {
    const x = '1mm';
    const div = document.createElement('div') as HTMLDivElement;
    div.style.display = 'block';
    div.style.height = x;
    document.body.appendChild(div);
    const px = parseFloat(window.getComputedStyle(div, null).height);
    div?.parentNode?.removeChild(div);
    return px;
  };

  const pixelRatio = getPixelRatio();
  const height = calculateCellHeight(val, width, '4mm Arial', pixelRatio);
  const newLines = val.match(/\n/g);
  const lineHeightA = 4;
  return (
    <div className="" style={{ background: 'white', height: '400px' }}>
      Hello
      {/*  */}
      <textarea
        name="abc"
        onChange={(e) => setVal(e.target.value)}
        value={val}
      />
      <p>New Lines: {newLines && newLines.length}</p>
      <p>Pixel Ratio: {pixelRatio}</p>
      <p>
        height: {height / pixelRatio}px {height}mm
      </p>
      <p>width: {width}</p>
      <div
        style={{
          width: `${width}mm`,
          height: `${height}mm`,
          outline: '1px solid red',
          overflow: 'hidden',
          padding: 0,
          margin: 0,
          font: 'Arial',
          fontSize: '4mm',
        }}
      >
        {val
          .trim()
          .split('\n')
          .map((t) => (
            <p
              className="line"
              style={{
                lineHeight: `${lineHeightA}mm`,
                padding: 0,
                margin: 0,
                font: 'Arial',
                fontSize: '4mm',
              }}
            >
              {t}
            </p>
          ))}
      </div>
    </div>
  );
};
export const fullPages = () => (
  <DocumentGenerator
    settings={SETTINGS}
    data={{}}
    template={{
      ...MOCK_JSON_PAGE(),
      body: {
        content: [H1('Head'), P('Hello'), MOCK_FULL_PAGE(), P('World')],
      },
    }}
  />
);
export const manualTemplateInput = () => {
  const [template, setTemplate] = useState('[]');

  return (
    <>
      <textarea
        onChange={(e) => setTemplate(e.target.value)}
        value={template}
      />
      <ErrorBoundary>
        <ShowDom contentString={template} />
      </ErrorBoundary>
    </>
  );
};
