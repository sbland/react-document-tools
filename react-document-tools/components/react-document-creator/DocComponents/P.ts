import { EContentType, ISettings, ITemplateContentItem } from '../lib';
import { getNextId } from '../utils/idGenerator';

export interface IPItem extends ITemplateContentItem {
  height: number;
}

export interface IPArgs {
  align?: 'left' | 'center' | 'right';
  font?: string;
  style?: React.CSSProperties;
  id?: string;
}

export const P =
  (text: string, { align = 'left', font = null, style = {}, id = 'MISSING_ID' }: IPArgs = {}) =>
  (settings: ISettings): IPItem => ({
    id,
    uid: getNextId(),
    type: EContentType.P,
    text,
    height: settings.lineHeight,
    align,
    style: { ...style, ...(settings?.styleOverrides?.p || {}) },
    font: font || settings.defaultFont,
  });
