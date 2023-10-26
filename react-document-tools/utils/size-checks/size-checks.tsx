export const getPixelRatio = () => {
  if (getPixelRatio.ratio != null) return getPixelRatio.ratio;
  const div = document.createElement('div');
  const x = '1mm';
  div.style.display = 'block';
  div.style.height = x;
  document.body.appendChild(div);
  const px = parseFloat(window.getComputedStyle(div, null).height);
  // div.parentNode.removeChild(div);
  getPixelRatio.ratio = px;
  return px;
};

getPixelRatio.ratio = null;

export const mmToPx = (mm: number): number => {
  // TODO: Below may work on firefox
  // const dpi = window.devicePixelRatio;
  // const out = (60 * (mm * dpi)) / 25.4;
  // return out;

  const pixelRatio = getPixelRatio();
  return mm * pixelRatio;
};

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

export const getTextWidth = (txt, font) => {
  /* https://stackoverflow.com/a/31305410/10259813 */

  if (!getTextWidth.canvas) {
    getTextWidth.canvas = document.createElement('canvas');
  }
  const element: HTMLCanvasElement = getTextWidth.canvas;

  const context = element.getContext('2d');

  context.font = font;
  return context.measureText(txt).width;
};

getTextWidth.canvas = null;

export const getTextHeight: Function & { canvas: HTMLCanvasElement } = (txt, font) => {
  /* https://stackoverflow.com/a/31305410/10259813 */

  const { lineHeight = null } = font ? parseFont(font) : {};
  if (lineHeight) {
    return parseFloat(lineHeight) * getPixelRatio() * 1.0;
  }
  if (!getTextHeight.canvas) {
    getTextHeight.canvas = document.createElement('canvas');
  }
  const element = getTextHeight.canvas;

  const context = element.getContext('2d');

  context.font = font;
  return parseFloat(context.font);
};
getTextHeight.canvas = null;

export const getTextAreaSize = (txt, font) => {
  /* https://stackoverflow.com/a/31305410/10259813 */

  if (!getTextAreaSize.canvas) {
    getTextAreaSize.canvas = document.createElement('canvas');
  }
  const element: HTMLCanvasElement = getTextAreaSize.canvas;

  const context = element.getContext('2d');

  const { lineHeight = null } = font ? parseFont(font) : {};
  context.font = font;
  const tsize = {
    width: context.measureText(txt).width,
    height: lineHeight ? parseFloat(lineHeight) * getPixelRatio() : parseFloat(context.font),
  };
  return tsize;
};

getTextAreaSize.canvas = null;

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
  const height = paperHeight - marginTop - marginBottom - headerHeight - footerHeight;

  const width = paperWidth - marginLeft - marginRight;
  const pageHeight = paperHeight - marginTop - marginBottom;
  return { width, height, pageHeight };
};
