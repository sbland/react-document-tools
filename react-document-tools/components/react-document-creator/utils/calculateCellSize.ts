import { AnyTemplateComponentType } from '../DocComponents';
import { IHeading, ISettings } from '../lib';
import {
  getPixelRatio,
  getTextHeight,
  getTextWidth,
} from '@react-document-tools/utils.size-checks';

const extraPadding = 0.0; /* Temp fix to stop text clipping */

export const calculateCellHeight = (
  textContent: string,
  width: number, // in mm
  font: string,
  pixelRatioIn: number | null = null,
  lineHeightIn: number | null = null
) => {
  if (!font) throw Error(`Missing font for text: "${textContent}"`);
  // Must be in mm
  // eslint-disable-next-line no-unused-vars
  const pixelRatio = pixelRatioIn || getPixelRatio();
  const lineHeight = lineHeightIn || getTextHeight(textContent, font);
  if (!textContent) return lineHeight / pixelRatio;

  const stripText = (textContent && textContent.trim()) || ' ';
  const startLineCount = 1;
  const textLines = stripText.split(/\n/g);
  const scaledWidth = width * pixelRatio; // width in pixels
  const spaceWidth = getTextWidth(' ', font);

  const blocks = textLines.map((textSingleLine) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [lineCount, _finalRemainingWidth] = (textSingleLine || '')
      .split(' ')
      .reduce(
        (acc, word) => {
          const [currLineCount, remainingWidth] = acc;
          const wordWidth = getTextWidth(word, font) + spaceWidth; // pixels
          /* Start new line if the word is less than the total width and greater than the remaining width */
          const startNewLine =
            remainingWidth <= scaledWidth && wordWidth > remainingWidth;
          const newRemainingWidth = startNewLine
            ? scaledWidth - wordWidth
            : remainingWidth - wordWidth;
          const newLineCount = startNewLine ? currLineCount + 1 : currLineCount;
          return [newLineCount, newRemainingWidth];
        },
        [startLineCount, scaledWidth]
      );
    return (parseFloat(lineHeight) * lineCount) / pixelRatio;
  });
  const totalHeight = blocks.reduce((acc, v) => acc + v);
  return totalHeight + extraPadding;
};

export const calculateCellHeightMultiType = (
  content:
    | AnyTemplateComponentType[][]
    | AnyTemplateComponentType[]
    | AnyTemplateComponentType
    | string,
  width: number,
  cellPadding: number,
  font: string
) => {
  const contentWidth = width - cellPadding * 1;
  let cellHeight = 0;

  if (typeof content === 'string') {
    cellHeight = calculateCellHeight(content, contentWidth, font);
  } else if (Array.isArray(content)) {
    // TODO: DIfficult to calculate the height here if content wraps instead of stacks
    // cellHeight = Math.max(
    //   ...content.map((c) => calculateCellHeightMultiType(width, c || '', cellPadding, font))
    // );
    // TODO: Possible type issue here
    cellHeight = (content as AnyTemplateComponentType[]).reduce(
      (acc, c) =>
        acc +
        calculateCellHeightMultiType(c || '', contentWidth, cellPadding, font),
      0
    );
  } else if (
    typeof content === 'object' &&
    content.height &&
    content.height !== 'auto'
  ) {
    cellHeight = content.height;
  } else if (typeof content === 'object' && (content.text || content.content)) {
    cellHeight = calculateCellHeightMultiType(
      content.text || content.content,
      contentWidth,
      0,
      content.font || font
    );
  }
  const cellHeightTotal = cellHeight + cellPadding * 1;
  return cellHeightTotal;
};

export const calculateTableRowHeight = (
  row,
  columnWidths: number[],
  cellPadding: number,
  font: string,
  settings: ISettings
) => {
  const contentSizes = columnWidths.map((w, i) => {
    const s = calculateCellHeightMultiType(row[i] || '', w, cellPadding, font);
    return s;
  });
  return Math.min(
    settings.maxRowHeight,
    Math.max(settings.minRowHeight, Math.max(...contentSizes))
  );
};

export const calculateTableRowHeights = (
  content,
  columnWidths,
  cellPadding,
  font,
  settings
) => {
  const rowHeights = content.map((row) =>
    calculateTableRowHeight(row, columnWidths, cellPadding, font, settings)
  );

  return rowHeights;
  // For each row find the largest content to width ratio
};

export const calculateTableColumnWidths = (
  content,
  headings: IHeading[],
  maxWidth: number
) => {
  if (!maxWidth) throw Error('Must have max width to calculate column widths');
  if (!headings)
    throw Error('Must supply headingsMeta for calculate column widths');
  const totalColumnWidth = headings.reduce((acc, h) => acc + h.width || 0, 0);
  const remainingWidth = maxWidth - totalColumnWidth;
  if (remainingWidth < 0) {
    throw Error('Column widths exceed table width');
  }
  const expandableColumns = headings.filter((h) => h.expand).length;
  const expandAll = !expandableColumns;
  const expandPerColumn = expandAll
    ? remainingWidth / headings.length
    : remainingWidth / expandableColumns;
  const columnsWidthsCalculated = headings.map((h) => {
    return h.expand || expandAll
      ? (h.width || 0) + expandPerColumn
      : h.width || 0;
  });
  return columnsWidthsCalculated;
};
