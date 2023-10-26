import { EContentType, ISettings, ITemplateContentItem } from '../lib';
import { getNextId } from '../utils/idGenerator';

export enum EEmbedType {
  PDF = 'PDF',
}

export interface IEmbedItem extends ITemplateContentItem {
  src: string;
  embedType: EEmbedType;
}

export interface IEmbedArgs {
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
}

/**
 * Embed different files.
 * @param {String} src path to src for embed
 * @param {string} type one of ['PDF']
 * @param {number} height
 * @param {number} width
 */
export const Embed =
  (
    id: string,
    src: string,
    type: EEmbedType,
    height: 'auto' | number,
    width: 'auto' | number,
    { align = 'left', style = {} }: IEmbedArgs = {}
  ) =>
  (settings: ISettings): IEmbedItem => ({
    id,
    uid: getNextId(),
    type: EContentType.EMBED,
    embedType: type,
    src,
    height,
    width,
    align,
    style: { ...style, ...(settings?.styleOverrides?.div || {}) },
  });
