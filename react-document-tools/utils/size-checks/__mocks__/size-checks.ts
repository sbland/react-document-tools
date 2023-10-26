export const getPixelRatio = () => {
  return 1;
};

// export const calculateCellHeight = (text, width) => {
//   // eslint-disable-next-line no-unused-vars
//   const [lineCount, finalRemainingWidth] = (text || '').split(' ').reduce(
//     (acc, word) => {
//       const [currLineCount, remainingWidth] = acc;
//       const wordWidth = word.length * charWidth;
//       const startNewLine = remainingWidth < width && wordWidth > remainingWidth;
//       const newRemainingWidth = startNewLine ? width - wordWidth : remainingWidth - wordWidth;
//       const newLineCount = startNewLine ? currLineCount + 1 : currLineCount;
//       return [newLineCount, newRemainingWidth];
//     },
//     [1, width]
//   );
//   return lineHeight * lineCount;
// };

function parseFont(font) {
  let fontFamily = null;

  let fontSize = null;
  let fontStyle = 'normal';
  let fontWeight = 'normal';
  let fontVariant = 'normal';
  let lineHeight = 'normal';

  const elements = font.split(/\s+/);
  elements.forEach((element) => {
    switch (element) {
      case 'normal':
        break;

      case 'italic':
      case 'oblique':
        fontStyle = element;
        break;

      case 'small-caps':
        fontVariant = element;
        break;

      case 'bold':
      case 'bolder':
      case 'lighter':
      case '100':
      case '200':
      case '300':
      case '400':
      case '500':
      case '600':
      case '700':
      case '800':
      case '900':
        fontWeight = element;
        break;

      default:
        if (!fontSize) {
          const parts = element.split('/');
          [fontSize] = parts;
          if (parts.length > 1) [, lineHeight] = parts;
          break;
        }

        fontFamily = element;
        // eslint-disable-next-line prefer-template
        if (elements.length) fontFamily += ' ' + elements.join(' ');
      // break outer;
    }
  });

  return {
    fontStyle,
    fontVariant,
    fontWeight,
    fontSize,
    lineHeight,
    fontFamily,
  };
}

export const getTextAreaSize = (txt, font) => {
  const parsedFont = font ? parseFont(font) : {};
  const { fontSize, lineHeight } = parsedFont as any;
  const fontSizeParsed = fontSize ? parseFloat(fontSize.split('mm')[0]) : 99;
  const lineHeightParsed = lineHeight
    ? parseFloat(lineHeight.split('mm')[0])
    : 99;
  return {
    width: txt ? fontSizeParsed * txt.length : 0,
    height: lineHeightParsed,
  };
};

export const getTextWidth = (txt, font) => {
  const parsedFont = font ? parseFont(font) : {};
  const { fontSize } = parsedFont as any;
  const fontSizeParsed = fontSize ? parseFloat(fontSize.split('mm')[0]) : 99;
  return txt ? fontSizeParsed * txt.length : 0;
};

export const getTextHeight = (txt, font) => {
  /* https://stackoverflow.com/a/31305410/10259813 */

  const parsedFont = font ? parseFont(font) : {};
  const { lineHeight } = parsedFont as any;
  const lineHeightParsed = lineHeight
    ? parseFloat(lineHeight.split('mm')[0])
    : 99;
  return lineHeightParsed;
};

export const calculateBodyDimensions = (settings) => {
  const {
    paperHeight,
    paperWidth,
    headerHeight,
    footerHeight,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
  } = settings;
  const height =
    paperHeight - marginTop - marginBottom - headerHeight - footerHeight;

  const width = paperWidth - marginLeft - marginRight;
  const pageHeight = paperHeight - marginTop - marginBottom;
  return { width, height, pageHeight };
};

export const mmToPx = (mm) => {
  const pixelRatio = getPixelRatio();
  return mm * pixelRatio;
};
