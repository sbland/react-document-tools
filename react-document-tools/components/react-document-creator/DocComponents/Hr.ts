import { EContentType, ISettings, ITemplateContentItem } from '../lib';
import { getNextId } from '../utils/idGenerator';

export interface IHrItem extends ITemplateContentItem {
  marginTop: number;
  marginBottom: number;
}

export const Hr =
  (marginTop = 10, marginBottom = 10, { style = {}, id="MISSING_ID" } = {}) =>
  (settings: ISettings): IHrItem => ({
    id,
    uid: getNextId(),
    type: EContentType.HR,
    height: marginTop + marginBottom,
    marginTop,
    marginBottom,
    style: { ...style, ...(settings?.styleOverrides?.hr || {}) },
  });
