import { AnyTemplateComponentType } from '.';
import { EContentType, ElementTypes, ISettings, ITemplateContentItem } from '../lib';
import { processElement } from '../utils/helpers';
import { getNextId } from '../utils/idGenerator';

export interface ISectionItem extends ITemplateContentItem {
  children: AnyTemplateComponentType[];
}

export const Section =
  (children: ElementTypes[], { id = 'MISSING_ID' } = {}) =>
  (settings: ISettings): ISectionItem => ({
    id,
    uid: getNextId(),
    type: EContentType.SECTION,
    children: children?.map((c) => processElement(c, settings)),
    // children: children?.map((c) => (typeof c === 'function' ? c(settings) : c)),
    height: 50,
  });
