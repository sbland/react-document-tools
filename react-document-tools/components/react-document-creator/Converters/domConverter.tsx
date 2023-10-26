/* eslint-disable no-use-before-define */
import React from 'react';
import PropTypes from 'prop-types';
import { Document, Page, pdfjs } from 'react-pdf';

import { mmToPx } from '@react-document-tools/utils.size-checks';
import { EContentType, validComponents } from '../lib';
import { DEFAULT_SETTINGS } from '../constants';
import {
  IDomComponentProps,
  IPageOptions,
  ISettings,
  IStyleOverrides,
  ITemplateProcessed,
} from '../lib';
import { EEmbedType, IEmbedItem } from '../DocComponents/Embed';
import {
  AnyTemplateComponentType,
  IImgItem,
  ITableItem,
  ISectionItem,
  IHrItem,
  IContainerItem,
  IFullPageItem,
  P,
  IDivItem,
} from '../DocComponents';
import styled from 'styled-components';

pdfjs.GlobalWorkerOptions.workerSrc = `/source/pdf.worker.js`;

const EmbedDiv = styled.div`
  .react-pdf__Document {
    position: absolute;
    left: 0;
    top: 0;
    transform: scale(0.25);
    transform-origin: top left;
  }
`;

export const jsonToDom = (
  template: ITemplateProcessed,
  bodyHeight: number,
  pageOptions: IPageOptions,
  settings: ISettings = DEFAULT_SETTINGS
) => {
  const processedTemplate = template;
  return (
    <div
      data-testid="docGen-pageInner"
      style={{
        paddingLeft: `${settings.marginLeft || 0}mm`,
        paddingRight: `${settings.marginRight || 0}mm`,
        paddingBottom: `${settings.marginBottom || 0}mm`,
        paddingTop: `${settings.marginTop || 0}mm`,
      }}
    >
      {processedTemplate.header && pageOptions.includeHeader && (
        <DocSection
          id="header"
          uid="header"
          width={settings.paperWidth}
          height={settings.headerHeight}
          content={processedTemplate.header.content}
          settings={settings}
        />
      )}
      <DocSection
        id="body"
        uid="body"
        height={bodyHeight}
        width={settings.paperWidth}
        content={processedTemplate.body.content}
        settings={settings}
      />
      {processedTemplate.footer && pageOptions.includeFooter && (
        <DocSection
          id="footer"
          uid="footer"
          height={settings.footerHeight}
          width={settings.paperWidth}
          content={processedTemplate.footer.content}
          settings={settings}
        />
      )}
    </div>
  );
};

const alignStyle = (align) => {
  return {
    textAlign: align,
    display: align !== 'left' ? 'flex' : 'auto',
    justifyContent:
      (align === 'center' && 'center') ||
      (align === 'right' && 'flex-end') ||
      undefined,
  };
};

export const objToDom = (
  rawObj: AnyTemplateComponentType | string,
  settings = DEFAULT_SETTINGS
) => {
  // let data: AnyTempateComponentType[] | string = typeof rawObj === 'function' ? (rawObj as ElementTypeFunction)(settings) : rawObj;
  let data = rawObj;
  if (typeof data === 'string') data = P(data)(settings);

  if (Array.isArray(data)) return <>{data.map((o) => objToDom(o, settings))}</>;
  const { text, height, width, type, align, uid, style } = data;
  const { styleOverrides = {} as IStyleOverrides } = settings;
  // TODO: Handle array key
  // if(data === null || data === undefined) return '';
  const heightString =
    height != null ? (height === 'auto' ? height : `${height}mm`) : undefined;
  const widthString =
    width != null ? (width === 'auto' ? width : `${width}mm`) : undefined;
  const styleTypeOverrides: React.CSSProperties =
    styleOverrides[type] || styleOverrides.p;
  const baseStyle: React.CSSProperties = {
    color: settings.fontColor,
    lineHeight: `${settings.lineHeight}mm`,
    ...styleTypeOverrides,
    height: heightString,
    width: widthString,
    ...(align ? alignStyle(align) : {}),
    ...style,
  };
  switch (type) {
    case EContentType.PAGEBREAK:
      return (
        <div
          className="gen_pagebreak"
          key={uid}
          style={{ height: heightString }}
        />
      );
    case EContentType.SPAN:
      // TODO: May need string again
      return (
        <span className="gen_span" key={uid} style={baseStyle}>
          {text}
        </span>
      );
    case EContentType.P:
      return (
        <p className="gen_p" key={uid} style={baseStyle}>
          {text}
        </p>
      );
    case EContentType.B:
      return (
        <b className="gen_b" key={uid} style={baseStyle}>
          {text}
        </b>
      );
    case EContentType.CONTAINER: {
      const d = data as IContainerItem;
      const content = Array.isArray(d.content) ? d.content : [d.content];
      return (
        <div className="gen_container" key={uid} style={baseStyle}>
          {content.map((c) => (c ? objToDom(c, settings) : null))}
        </div>
      );
    }
    case EContentType.DIV /* divs are split into a div per new line as otherwise new lines are ignored! */: {
      const d = data as IDivItem;
      return (
        // TODO: If div is too big for page it should be able to span multiple pages
        <div className="gen_div" key={uid} style={baseStyle}>
          {processDivContent(uid, d.content, baseStyle, settings)}
        </div>
      );
    }
    case EContentType.H1:
      return (
        <h1 className="gen_h1" key={uid} style={baseStyle}>
          {text}
        </h1>
      );
    case EContentType.H2:
      return (
        <h2 className="gen_h2" key={uid} style={baseStyle}>
          {text}
        </h2>
      );
    case EContentType.H3:
      return (
        <h3 className="gen_h3" key={uid} style={baseStyle}>
          {text}
        </h3>
      );
    case EContentType.H4:
      return (
        <h4 className="gen_h4" key={uid} style={baseStyle}>
          {text}
        </h4>
      );
    case EContentType.IMG: {
      const d = data as IImgItem;
      return (
        <img
          className="gen_img"
          key={uid}
          style={{
            ...baseStyle,
            width: 'auto',
            height: 'auto',
            maxWidth: widthString === 'auto' ? '100%' : widthString,
            maxHeight: heightString === 'auto' ? '100%' : heightString,
          }}
          src={d.src}
          alt={d.altText || ' '}
        />
      );
    }
    case EContentType.TABLE: {
      const d = data as ITableItem;
      return (
        <DocTable
          key={uid}
          uid={uid}
          height={height}
          width={(width as number) || 'auto'}
          headings={d.headings}
          columnWidths={d.columnWidths}
          rowHeights={d.rowHeights}
          content={d.content}
          cellPadding={d.cellPadding}
          headerRowHeight={d.headingsHeight}
          headingMargin={d.headingsMargin}
          settings={settings}
        />
      );
    }
    case EContentType.SECTION: {
      const d = data as ISectionItem;
      return (
        <section className="gen_section" key={uid}>
          {d.children.map((child) => objToDom(child, settings))}
        </section>
      );
    }
    case EContentType.HR: {
      const d = data as IHrItem;
      return (
        <hr
          className="gen_hr"
          key={uid}
          style={{
            ...style,
            marginTop: d.marginTop - 0.5,
            marginBottom: d.marginBottom - 0.5,
          }}
        />
      );
    }
    case EContentType.EMBED: {
      const d = data as IEmbedItem;
      const widthLim = parseInt(String(mmToPx(width as number)));
      switch (d.embedType) {
        case EEmbedType.PDF:
          return (
            <EmbedDiv
              className="gen_embed_pdf"
              key={uid}
              style={{
                ...style,
                height: heightString,
                width: widthString,
                ...alignStyle(align),
              }}
            >
              <Document file={d.src}>
                <Page pageNumber={1} width={widthLim} scale={4} />
              </Document>
            </EmbedDiv>
          );
        default:
          throw Error('Invalid embed type');
      }
    }
    case EContentType.FULL_PAGE: {
      const d = data as IFullPageItem;
      const content = (Array.isArray(d.content) ? d.content : [d.content]).map(
        (c) => objToDom(c, settings)
      );
      // TODO: Check this works as should have been resolved elsewhere
      return jsonToDom(
        { body: { content } },
        settings.internalHeight,
        {} as IPageOptions,
        settings
      );
    }
    default:
      throw Error(`Invalid obj: ${data}`);
    // return (
    //   <p className="gen_invalid" key={uid}>
    //     INVALID TYPE: {JSON.stringify(data)}
    //   </p>
    // );
  }
};

export const processDivContent = (uid, content, baseStyle, settings) => {
  if (!content) return '';
  if (typeof content === 'string') {
    return (
      content
        // .trim()
        .split('\n')
        .map((t) => {
          return (
            <div
              className="gen_div_line"
              key={`${uid}_${t}`}
              style={{ ...baseStyle, minHeight: `${settings.lineHeight}mm` }}
            >
              {t}
            </div>
          );
        })
    );
  }
  if (typeof content === 'object') return objToDom(content, settings);
  throw Error(`Unknown content type: ${typeof content}`);
};

let randId = 0;

const getRowId = (data) => {
  const j = 0;
  if (typeof data[j] === 'string') {
    // eslint-disable-next-line no-plusplus
    return data[j] ? `${data.join(' ')}${data[j]}` : randId++;
  }
  if (typeof data[j] === 'object' && data[j].uid) {
    // eslint-disable-next-line no-plusplus
    return data[j].uid || randId++;
  }
  // eslint-disable-next-line no-plusplus
  return randId++;
};

const getCellId = (data, j) => {
  if (typeof data[j] === 'string') {
    // eslint-disable-next-line no-plusplus
    return data[j] ? `${data.join(' ')}${data[j]}` : randId++;
  }
  if (typeof data[j] === 'object' && data[j].uid) {
    // eslint-disable-next-line no-plusplus
    return data[j].uid || randId++;
  }
  // eslint-disable-next-line no-plusplus
  return randId++;
};

export interface IDocTableProps extends IDomComponentProps {
  columnWidths;
  rowHeights;
  content: AnyTemplateComponentType[][];
  headings: AnyTemplateComponentType[] | null;
  headerRowHeight: number;
  headingMargin: number;
  cellPadding: number;
}

export const DocTable = ({
  uid,
  height,
  width,
  columnWidths,
  rowHeights,
  content,
  headings,
  headerRowHeight,
  headingMargin,
  cellPadding = 0,
  settings = DEFAULT_SETTINGS,
}: IDocTableProps) => {
  if (rowHeights.length !== content.length)
    throw Error(`Error in table ${uid}: Content length must match row length`);
  if (content[0] && columnWidths.length !== content[0].length) {
    throw Error(
      `Error in table ${uid}: Content row length must match column widths length`
    );
  }
  if (content.some((row) => !row || typeof row !== 'object')) {
    throw Error(`Error in table ${uid}: Invalid rows in content`);
  }
  const { styleOverrides: { table: tableStyleOverrides = {} } = {} } = settings;

  const tableStyle: React.CSSProperties = {
    ...tableStyleOverrides,
    height: `${height}mm`,
    width: `${width}mm`,
    display: 'flex',
    flexDirection: 'column',
  };

  // TODO: Offset padding to line up text
  const tableRowStyle = (i) => ({
    width: `${width}mm`,
    height: `${rowHeights[i]}mm`,
    display: 'flex',
  });

  const headerRowStyle = () => ({
    width: `${width}mm`,
    height: `${headerRowHeight}mm`,
    display: 'flex',
    borderBottom: '0.2mm solid black',
    marginBottom: `${headingMargin}mm`,
    // marginBottom: `${padding - 0.2}mm`,
  });
  const tableCellStyle = (i, j) => ({
    width: `${columnWidths[j]}mm`,
    height: `${rowHeights[i]}mm`,
    padding: cellPadding ? ` 0 ${cellPadding}mm ${cellPadding}mm 0` : 0,
    lineHeight: `${rowHeights[i]}mm`, // TODO: This could cause issues if row height is large
  });

  const tableHeaderStyle = (j) => ({
    width: `${columnWidths[j]}mm`,
    height: `${headerRowHeight}mm`,
    padding: cellPadding ? ` 0 ${cellPadding}mm ${cellPadding}mm 0` : 0,
    lineHeight: `${headerRowHeight}mm`, // TODO: This could cause issues if row height is large
  });

  return (
    <div className="docTable" style={tableStyle}>
      {headings && (
        <div className="docTable_row" style={headerRowStyle()}>
          {columnWidths.map((w, j) => (
            <div
              key={headings[j].uid}
              style={tableHeaderStyle(j)}
              className="docTable_cell_heading"
            >
              {objToDom(headings[j], settings)}
            </div>
          ))}
        </div>
      )}
      {content.map((row, i) => (
        <div
          key={getRowId(row)}
          className="docTable_row"
          style={tableRowStyle(i)}
        >
          {columnWidths.map((w, j) => (
            <div
              key={getCellId(row, j)}
              style={tableCellStyle(i, j)}
              className="docTable_cell"
            >
              {objToDom(row && row[j], settings)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

DocTable.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  columnWidths: PropTypes.arrayOf(PropTypes.number).isRequired,
  rowHeights: PropTypes.arrayOf(PropTypes.number).isRequired,
  content: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object]))
  ).isRequired,
  headings: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.shape({}), PropTypes.node])
  ),
  headerRowHeight: PropTypes.number.isRequired,
  cellPadding: PropTypes.number,
  settings: PropTypes.shape({
    // see DEFAULT_SETTINGS
  }).isRequired,
};

DocTable.defaultProps = {
  cellPadding: 0,
  headings: null,
};

export interface IDocSectionProps extends IDomComponentProps {
  content: AnyTemplateComponentType[];
  id: string;
}

export const DocSection = ({
  id,
  height,
  content,
  settings,
}: IDocSectionProps) => (
  <div
    style={{
      height: `${height}mm`,
      position: 'relative',
    }}
    id={id}
    data-testid={`docGen-section-${id}`}
  >
    {content?.map((child) => objToDom(child, settings)) || 'Missing Content'}
  </div>
);

DocSection.propTypes = {
  id: PropTypes.any.isRequired,
  height: PropTypes.number.isRequired,
  content: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(validComponents).isRequired,
      content: PropTypes.arrayOf(PropTypes.any),
    })
  ).isRequired,
  settings: PropTypes.shape({}).isRequired,
};
