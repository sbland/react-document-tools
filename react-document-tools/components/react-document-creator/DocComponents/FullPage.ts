import { AnyTemplateComponentType } from '.';
import { ElementTypeFunction, EContentType, ISettings, ITemplateContentItem } from '../lib';
import { getNextId } from '../utils/idGenerator';

export interface IFullPageItem extends Omit<ITemplateContentItem, 'content'> {
  content: AnyTemplateComponentType[];
}

export const FullPage =
  (content: ElementTypeFunction[], id = 'MISSING_ID') =>
  (settings: ISettings): IFullPageItem => {
    const contentActivated = content.map((c) => c(settings));
    return {
      id,
      uid: getNextId(),
      type: EContentType.FULL_PAGE,
      content: contentActivated,
      height: 'auto',
    };
  };
