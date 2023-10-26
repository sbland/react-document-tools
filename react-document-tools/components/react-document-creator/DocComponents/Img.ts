import { EContentType, ITemplateContentItem } from '../lib';
import { getNextId } from '../utils/idGenerator';

export interface IImgItem extends ITemplateContentItem {
  src: string;
  altText: string;
  type: EContentType.IMG;
}

export const Img =
  (
    src: string,
    width: number | 'auto',
    height: number | 'auto',
    altText: string,
    { style = {}, id = 'MISSING_ID' } = {}
  ) =>
  (settings): IImgItem => ({
    uid: id ? `${id}_${getNextId()}` : getNextId(),
    id: id || altText || 'MISSING ID',
    type: EContentType.IMG,
    src,
    height,
    width,
    altText,
    style: { ...(settings?.styleOverrides?.img || {}), ...style },
  });
