import { IBItem } from './B';
import { IDivItem } from './Div';
import { IContainerItem } from './Container';
import { IEmbedItem } from './Embed';
import { IFullPageItem } from './FullPage';
import { IHItem } from './H';
import { IHrItem } from './Hr';
import { IImgItem } from './Img';
import { IPItem } from './P';
import { IPageBreakItem } from './PageBreak';
import { ISectionItem } from './Section';
import { ISpanItem } from './Span';
import { ITableItem } from './Table';

export { B } from './B';
export { Div } from './Div';
export { Container } from './Container';
export { Embed } from './Embed';
export { FullPage } from './FullPage';
export { H, H1 } from './H';
export { Hr } from './Hr';
export { Img } from './Img';
export { P } from './P';
export { PageBreak } from './PageBreak';
export { Section } from './Section';
export { Span } from './Span';
export { Table, TableCell } from './Table';

export type { IBItem } from './B';
export type { IDivItem } from './Div';
export type { IContainerItem } from './Container';
export type { IEmbedItem } from './Embed';
export type { IFullPageItem } from './FullPage';
export type { IHItem } from './H';
export type { IHrItem } from './Hr';
export type { IImgItem } from './Img';
export type { IPItem } from './P';
export type { IPageBreakItem } from './PageBreak';
export type { ISectionItem } from './Section';
export type { ISpanItem } from './Span';
export type { ITableItem } from './Table';

export type AnyTemplateComponentType =
  | IBItem
  | IDivItem
  | IContainerItem
  | IEmbedItem
  | IFullPageItem
  | IHItem
  | IHrItem
  | IImgItem
  | IPItem
  | IPageBreakItem
  | ISectionItem
  | ISpanItem
  | ITableItem;
