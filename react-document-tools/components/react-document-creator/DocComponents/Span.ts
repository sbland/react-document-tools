import { EContentType, ISettings, ITemplateContentItem } from '../lib';
import { getNextId } from '../utils/idGenerator';

export interface ISpanItem extends ITemplateContentItem {}

export interface ISpanArgs {
  align?: 'left' | 'center' | 'right';
  font?: string;
  style?: React.CSSProperties;
  id?: string;
}

export const Span =
  (text: string, { align = 'left', font = null, style = {}, id = 'MISSING_ID' }: ISpanArgs = {}) =>
  (settings: ISettings): ISpanItem => ({
    id,
    uid: getNextId(),
    type: EContentType.SPAN,
    text,
    height: settings.lineHeight,
    align,
    style: { ...style, ...(settings?.styleOverrides?.p || {}) },
    font: font || settings.defaultFont,
  });
