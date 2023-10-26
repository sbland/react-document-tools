import { IPageOptions, ISettings } from './lib';
import { calcLineHeight, getFontString } from './utils/helpers';

export const textHeight = 3.8;
export const lineHeight = 4.5;
export const headingHeight = textHeight * 1.2;
export const charWidth = 2.15;
export const fontWeight = 100;
export const fontFamily = 'Arial';

export const minRowHeight = lineHeight;
export const maxRowHeight = 100;

export const textHeightPadded = textHeight * 1;

export const defaultFont = `${fontWeight} ${textHeightPadded.toFixed(
  0
)}mm/${lineHeight}mm  ${fontFamily}`;
export const defaultHeadingFont = `${headingHeight.toFixed(
  0
)}mm/${headingHeight}mm ${fontFamily}`;

export const calcSettingsFromTextHeight = (
  fontWeightIn: number,
  textHeightIn: number,
  lineHeightIn: number,
  fontFamilyIn: string = 'Arial'
) => {
  const lineHeightCalced = lineHeightIn || calcLineHeight(textHeightIn);
  const headingHeightCalced = textHeightIn * 1.2;
  return {
    textHeight: textHeightIn,
    lineHeight: lineHeightCalced,
    headingHeight: headingHeightCalced,
    minRowHeight: lineHeightCalced,
    defaultFont: getFontString(
      fontWeight,
      textHeight,
      lineHeightCalced,
      fontFamilyIn
    ),
    fontFamily: fontFamilyIn,
    fontWeight: fontWeightIn,
    defaultHeadingFont: `${headingHeightCalced.toFixed(
      0
    )}mm/${headingHeightCalced}mm ${fontFamilyIn}`,
  };
};
// eslint-disable-next-line no-underscore-dangle
export const _PAGE_OPTIONS = {
  paperHeight: 296,
  paperWidth: 210,
  headerHeight: 22,
  footerHeight: 32,
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 10,
  marginRight: 10,
};

export const PAGE_OPTIONS: IPageOptions = {
  ..._PAGE_OPTIONS,
  internalWidth:
    _PAGE_OPTIONS.paperWidth -
    _PAGE_OPTIONS.marginLeft -
    _PAGE_OPTIONS.marginRight,
  internalHeight:
    _PAGE_OPTIONS.paperHeight -
    _PAGE_OPTIONS.marginTop -
    _PAGE_OPTIONS.marginBottom,
  // bodyHeight: _PAGE_OPTIONS.paperHeight - _PAGE_OPTIONS.marginTop - _PAGE_OPTIONS.marginBottom,
  bodyHeight:
    _PAGE_OPTIONS.paperHeight -
    _PAGE_OPTIONS.marginTop -
    _PAGE_OPTIONS.marginBottom -
    _PAGE_OPTIONS.headerHeight -
    _PAGE_OPTIONS.footerHeight,
};

export const calcPageSetting = (pageOptions: IPageOptions) => ({
  ...pageOptions,
  internalWidth:
    pageOptions.paperWidth -
    (pageOptions.marginLeft || 0) -
    (pageOptions.marginRight || 0),
  internalHeight:
    pageOptions.paperHeight -
    (pageOptions.marginTop || 0) -
    (pageOptions.marginBottom || 0),
});

export const DEFAULT_SETTINGS: ISettings = {
  // defaultFont: `100 4mm/4.5mm Arial`,
  textHeight,
  lineHeight,
  fontWeight,
  fontFamily,
  headingHeight,
  charWidth,
  minRowHeight,
  maxRowHeight,
  textHeightPadded,
  defaultFont,
  defaultHeadingFont,
  fontColor: 'black',
  tableHeadingsMargin: 3,
  fileServerUrl: 'http://localhost:3000',
  ...PAGE_OPTIONS,
  // pageOptions: PAGE_OPTIONS,
};
