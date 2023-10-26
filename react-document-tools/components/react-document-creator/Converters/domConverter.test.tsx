import React from 'react';
import { render } from '@testing-library/react';
import { jsonToDom, objToDom } from './domConverter';
import {
  MOCK_BOLD,
  MOCK_DIV,
  MOCK_DIV_CENTER,
  MOCK_HEADER,
  MOCK_HR,
  MOCK_IMAGE_EXAMPLE,
  MOCK_OPTIONS,
  MOCK_SPAN,
  MOCK_PARAGRAPH,
  MOCK_TABLE_CALCULATE_EXAMPLE,
  MOCK_TABLE_COMPLEX_EXAMPLE,
  MOCK_TABLE_EXAMPLE,
  MOCK_DIV_WITH_CHILDREN,
} from '../_mockComponents';
import { FullPage, P, PageBreak } from '../DocComponents';
import { processTemplate } from '../utils/helpers';
import { calculateBodyDimensions } from '@react-document-tools/utils.size-checks';
import { PAGE_OPTIONS } from '../constants';

jest.mock('@react-document-tools/utils.size-checks');
jest.mock('../utils/idGenerator');

describe('objToDom', () => {
  test('should manage undefined values', () => {
    // @ts-ignore
    expect(() => objToDom()).toThrow();
    // const processedElement = objToDom();
    // const {baseElement} = render(<div>{processedElement}</div>);
    // baseElement(tree).toMatchSnapshot();
  });

  test('should not convert simple string to paragraph', () => {
    const processedElement = objToDom('Hello World', MOCK_OPTIONS);
    const { baseElement } = render(<div>{processedElement}</div>);
    expect(baseElement).toMatchSnapshot();
  });
  test('should convert a paragraph item', () => {
    const processedElement = objToDom(
      MOCK_PARAGRAPH()(MOCK_OPTIONS),
      MOCK_OPTIONS
    );
    const { baseElement } = render(<div>{processedElement}</div>);
    expect(baseElement).toMatchSnapshot();
  });

  test('should convert a span item', () => {
    const processedElement = objToDom(MOCK_SPAN()(MOCK_OPTIONS), MOCK_OPTIONS);
    const { baseElement } = render(<div>{processedElement}</div>);
    expect(baseElement).toMatchSnapshot();
  });

  test('should convert a bold item', () => {
    const processedElement = objToDom(MOCK_BOLD()(MOCK_OPTIONS), MOCK_OPTIONS);
    const { baseElement } = render(<div>{processedElement}</div>);
    expect(baseElement).toMatchSnapshot();
  });
  test('should convert a div item', () => {
    const processedElement = objToDom(MOCK_DIV()(MOCK_OPTIONS), MOCK_OPTIONS);
    const { baseElement } = render(<div>{processedElement}</div>);
    expect(baseElement).toMatchSnapshot();
  });
  test('should convert a div with children item', () => {
    const processedElement = objToDom(
      MOCK_DIV_WITH_CHILDREN()(MOCK_OPTIONS),
      MOCK_OPTIONS
    );
    const { baseElement } = render(<div>{processedElement}</div>);
    expect(baseElement).toMatchSnapshot();
  });
  test('should convert a heading item', () => {
    const processedElement = objToDom(
      MOCK_HEADER()(MOCK_OPTIONS),
      MOCK_OPTIONS
    );
    const { baseElement } = render(<div>{processedElement}</div>);
    expect(baseElement).toMatchSnapshot();
  });

  test('should convert a horizontal rule item', () => {
    const processedElement = objToDom(MOCK_HR()(MOCK_OPTIONS), MOCK_OPTIONS);
    const { baseElement } = render(<div>{processedElement}</div>);
    expect(baseElement).toMatchSnapshot();
  });

  test('should convert a img item', () => {
    const processedElement = objToDom(
      MOCK_IMAGE_EXAMPLE()(MOCK_OPTIONS),
      MOCK_OPTIONS
    );
    const { baseElement } = render(<div>{processedElement}</div>);
    expect(baseElement).toMatchSnapshot();
  });

  test('should convert a table item', () => {
    const processedElement = objToDom(
      MOCK_TABLE_EXAMPLE()(MOCK_OPTIONS),
      MOCK_OPTIONS
    );
    const { baseElement } = render(<div>{processedElement}</div>);
    expect(baseElement).toMatchSnapshot();
  });

  test('should convert a table item with nested objs', () => {
    const processedElement = objToDom(
      MOCK_TABLE_COMPLEX_EXAMPLE()(MOCK_OPTIONS),
      MOCK_OPTIONS
    );
    const { baseElement } = render(<div>{processedElement}</div>);
    expect(baseElement).toMatchSnapshot();
  });
  test('should convert a table that is calculated', () => {
    const processedElement = objToDom(
      MOCK_TABLE_CALCULATE_EXAMPLE()(MOCK_OPTIONS),
      MOCK_OPTIONS
    );
    const { baseElement } = render(<div>{processedElement}</div>);
    expect(baseElement).toMatchSnapshot();
  });
  test('should convert a centered div component', () => {
    const processedElement = objToDom(
      MOCK_DIV_CENTER()(MOCK_OPTIONS),
      MOCK_OPTIONS
    );
    const { baseElement } = render(<div>{processedElement}</div>);
    expect(baseElement).toMatchSnapshot();
    // eslint-disable-next-line testing-library/no-node-access
    expect(baseElement.children[0]).toMatchSnapshot();
  });
  test('should handle full page elements', () => {
    const { height } = calculateBodyDimensions(MOCK_OPTIONS);
    const template = {
      header: () => ({ content: [P('Header')] }),
      footer: () => ({ content: [P('Footer')] }),
      body: {
        content: [
          P('Hello'),
          PageBreak(),
          FullPage([P('Full page')]),
          PageBreak(),
          P('World'),
        ],
      },
    };

    const pageOptions = {
      ...PAGE_OPTIONS,
      includeHeader: false,
      includeFooter: false,
    };

    const processedTemplate = processTemplate(template, MOCK_OPTIONS);
    expect(processedTemplate).toMatchSnapshot();

    const Dom = jsonToDom(processedTemplate, height, pageOptions, MOCK_OPTIONS);

    const { baseElement } = render(<div className="">{Dom}</div>);
    expect(baseElement).toMatchSnapshot();
  });
});
