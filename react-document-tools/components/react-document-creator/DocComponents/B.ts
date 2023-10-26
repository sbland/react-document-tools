import { Uid } from '@react_db_client/constants.client-types';
import { EContentType, ISettings, ITemplateContentItem } from '../lib';
import { getNextId } from '../utils/idGenerator';

export interface IBItem extends ITemplateContentItem {}

export interface BArgs {
  align?: 'left' | 'center' | 'right';
  font?: string;
  style?: React.CSSProperties;
}

export const B =
  (text: string, { align = 'left', font = null, style = {} }: BArgs = {}, id?: Uid) =>
  (settings: ISettings): IBItem => ({
    id,
    uid: getNextId(),
    type: EContentType.B,
    text,
    height: settings.lineHeight,
    align,
    style: { ...style, ...(settings?.styleOverrides?.b || {}) },
    font: font || settings.defaultFont,
  });
