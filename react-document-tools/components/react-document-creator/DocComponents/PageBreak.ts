import { Uid } from '@react_db_client/constants.client-types';
import { EContentType, ISettings, ITemplateContentItem } from '../lib';
import { getNextId } from '../utils/idGenerator';

export interface IPageBreakItem extends ITemplateContentItem {
  width?: number;
  height: 'auto';
}

export const PageBreak =
  (id: Uid = 'MISSING_ID') =>
  (_settings: ISettings): IPageBreakItem => ({
    id: id,
    uid: getNextId(),
    type: EContentType.PAGEBREAK,
    height: 'auto',
  });
