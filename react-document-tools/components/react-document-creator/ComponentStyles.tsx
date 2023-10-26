import { getFontString } from './utils/helpers';
import { IStyleOverrides } from './lib';

export const defaultBaseStyle: React.CSSProperties = {
  padding: 0,
  margin: 0,
  whiteSpace: 'nowrap' as 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export const getFontStyle = (fontWeight, fontSize, lineHeight, fontFamily) => ({
  font: getFontString(fontWeight, fontSize, lineHeight, fontFamily),
  fontFamily,
  fontWeight,
  fontSize: `${fontSize}mm`,
  lineHeight: `${lineHeight}mm`,
});

export const styleDefaults = (
  fontWeight: number,
  fontSize: number,
  lineHeight: number,
  fontFamily: string,
  headingHeight: number,
  styleOverrides: Partial<IStyleOverrides> = {}
): IStyleOverrides => ({
  span: {
    padding: 0,
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    ...getFontStyle(fontWeight, fontSize, lineHeight, fontFamily),
    ...(styleOverrides?.span || {}),
  },
  p: {
    padding: 0,
    margin: 0,
    whiteSpace: 'nowrap' as 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    ...getFontStyle(fontWeight, fontSize, lineHeight, fontFamily),
    ...(styleOverrides?.p || {}),
  },
  b: {
    padding: 0,
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    ...getFontStyle('bold', fontSize, lineHeight, fontFamily),
    ...(styleOverrides?.b || {}),
  },
  div: {
    padding: 0,
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    ...getFontStyle(fontWeight, fontSize, lineHeight, fontFamily),
    ...(styleOverrides?.div || {}),
  },
  hr: {},
  h1: {
    height: `${headingHeight}mm`,
    padding: 0,
    margin: 0,
    ...getFontStyle('bold', headingHeight, lineHeight, fontFamily),
    ...(styleOverrides?.h1 || {}),
  },
  h2: {
    height: `${headingHeight}mm`,
    padding: 0,
    margin: 0,
    ...getFontStyle(fontWeight, headingHeight, lineHeight, fontFamily),
    ...(styleOverrides?.h2 || {}),
  },
  h3: {
    height: `${headingHeight}mm`,
    padding: 0,
    margin: 0,
    ...getFontStyle(fontWeight, headingHeight, lineHeight, fontFamily),
    ...(styleOverrides?.h3 || {}),
  },
  h4: {
    height: `${headingHeight}mm`,
    padding: 0,
    margin: 0,
    ...getFontStyle(fontWeight, headingHeight, lineHeight, fontFamily),
    ...(styleOverrides?.h4 || {}),
  },
  img: {
    display: 'block',
    padding: 0,
    margin: 0,
    ...(styleOverrides?.img || {}),
  },
  table: { padding: 0, margin: 0 },
  pdfwrapper: { padding: 0, margin: 0 },
});
