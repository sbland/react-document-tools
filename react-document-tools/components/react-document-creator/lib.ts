import { Uid } from '@react_db_client/constants.client-types';
import { AnyTemplateComponentType } from './DocComponents';

export interface IPageOptions {
  includeFooter?: boolean;
  includeHeader?: boolean;
  bodyHeight: number;
  headerHeight: number;
  footerHeight: number;
  marginLeft?: number;
  marginRight?: number;
  marginBottom?: number;
  marginTop?: number;
  paperWidth: number;
  paperHeight: number;
  internalWidth: number;
  internalHeight: number;
}

export interface IStyleOverrides {
  p: React.CSSProperties;
  table?: React.CSSProperties;
  div?: {};
  b?: {};
  h1?: {};
  h2?: {};
  h3?: {};
  h4?: {};
  hr?: {};
  span?: {};
  img?: {};
  pdfwrapper?: {};
}
export interface ISettings extends IPageOptions {
  textHeight: number;
  lineHeight: number;
  fontWeight: number;
  fontFamily: string;
  charWidth: number;
  minRowHeight: number;
  maxRowHeight: number;
  textHeightPadded: number;
  defaultFont: string;
  defaultHeadingFont: string;
  fontColor: string;
  styleOverrides?: IStyleOverrides;
  headingHeight: number;
  tableHeadingsMargin?: number;
  fileServerUrl?: string;
}

export const validComponents = [
  'pagebreak',
  'div',
  'p',
  'b',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h',
  'hr',
  'img',
  'section',
  'table',
  'embed',
  'container',
  'full_page',
];

export enum EContentType {
  PAGEBREAK = 'pagebreak',
  DIV = 'div',
  P = 'p',
  B = 'b',
  SPAN = 'span',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H = 'h',
  HR = 'hr',
  IMG = 'img',
  SECTION = 'section',
  TABLE = 'table',
  EMBED = 'embed',
  CONTAINER = 'container',
  FULL_PAGE = 'full_page',
}

export interface ITemplateContentItem {
  uid: Uid;
  id: Uid;
  text?: string;
  type: EContentType;
  height: number | 'auto';
  width?: number | 'auto';
  style?: React.CSSProperties;
  font?: string;
  content?: AnyTemplateComponentType | AnyTemplateComponentType[] | string;
  align?: 'left' | 'center' | 'right';
}

export type ElementTypeFunction = (setting: ISettings) => AnyTemplateComponentType;
export type ElementTypes = AnyTemplateComponentType | ElementTypeFunction | string;

export interface ITemplateBody {
  content: ElementTypes[];
  options?: {};
}

export interface ITemplateBodyProcessed {
  content: AnyTemplateComponentType[];
  options?: {};
}

export interface IHeaderArgs {
  date: string;
  pageNo: number;
  pageCount: number;
}
export interface IFooterArgs extends IHeaderArgs {}

export interface ITemplateHeader {
  content: ElementTypes[];
}
export interface ITemplateFooter {
  content: ElementTypes[];
}

export interface ITemplateHeaderProcessed {
  content: AnyTemplateComponentType[];
}
export interface ITemplateFooterProcessed {
  content: AnyTemplateComponentType[];
}
export interface ITemplate {
  type?: EContentType;
  body: ITemplateBody;
  header?: (args: IHeaderArgs) => ITemplateHeader;
  footer?: (args: IFooterArgs) => ITemplateHeader;
}

export interface ITemplateProcessed {
  body: ITemplateBodyProcessed;
  header?: ITemplateHeaderProcessed;
  footer?: ITemplateFooterProcessed;
}

export interface IDomComponentProps {
  uid: Uid;
  height: number | 'auto';
  width: number | 'auto';
  settings: ISettings;
}

export interface IHeading {
  width: number;
  expand?: boolean;
  options?: {
    align?: 'left' | 'center' | 'right';
  };
}
