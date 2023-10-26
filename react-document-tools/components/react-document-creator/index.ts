export { DocumentGenerator } from './react-document-creator';

export { B } from './DocComponents/B';
export { Div } from './DocComponents/Div';
export { Container } from './DocComponents/Container';
export { Embed } from './DocComponents/Embed';
export { FullPage } from './DocComponents/FullPage';
export { H, H1 } from './DocComponents/H';
export { Hr } from './DocComponents/Hr';
export { Img } from './DocComponents/Img';
export { P } from './DocComponents/P';
export { PageBreak } from './DocComponents/PageBreak';
export { Section } from './DocComponents/Section';
export { Span } from './DocComponents/Span';
export { Table, TableCell } from './DocComponents/Table';

export type { IBItem } from './DocComponents/B';
export type { IDivItem } from './DocComponents/Div';
export type { IContainerItem } from './DocComponents/Container';
export type { IEmbedItem } from './DocComponents/Embed';
export type { IFullPageItem } from './DocComponents/FullPage';
export type { IHItem } from './DocComponents/H';
export type { IHrItem } from './DocComponents/Hr';
export type { IImgItem } from './DocComponents/Img';
export type { IPItem } from './DocComponents/P';
export type { IPageBreakItem } from './DocComponents/PageBreak';
export type { ISectionItem } from './DocComponents/Section';
export type { ISpanItem } from './DocComponents/Span';
export type { ITableItem } from './DocComponents/Table';

export type { AnyTemplateComponentType } from './DocComponents';

export {
  textHeight,
  lineHeight,
  headingHeight,
  charWidth,
  fontWeight,
  fontFamily,
  minRowHeight,
  maxRowHeight,
  textHeightPadded,
  defaultFont,
  defaultHeadingFont,
  calcSettingsFromTextHeight,
  _PAGE_OPTIONS,
  PAGE_OPTIONS,
  calcPageSetting,
  DEFAULT_SETTINGS,
} from './constants';

export { useDocumentGenerator } from './useDocumentGenerator';
export type {
  IUseDocumentGeneratorArgs,
  IUseDocumentGeneratorReturn,
} from './useDocumentGenerator';

export {
  IPageOptions,
  IStyleOverrides,
  ISettings,
  ITemplateContentItem,
  ITemplateBody,
  ITemplateBodyProcessed,
  IHeaderArgs,
  IFooterArgs,
  ITemplateHeader,
  ITemplateFooter,
  ITemplateHeaderProcessed,
  ITemplateFooterProcessed,
  ITemplate,
  ITemplateProcessed,
  IDomComponentProps,
  IHeading,
} from './lib';

export { EContentType } from './lib';

export {
  processElement,
  processContent,
  processBody,
  processTemplate,
  getFontString,
  calcLineHeight,
} from './utils/helpers';

export {
  defaultBaseStyle,
  getFontStyle,
  styleDefaults,
} from './ComponentStyles';
