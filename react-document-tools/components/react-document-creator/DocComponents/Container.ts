import { EContentType, ElementTypes, ISettings, ITemplateContentItem } from '../lib';
import { processElement } from '../utils/helpers';
import { getNextId } from '../utils/idGenerator';

export interface IContainerItem extends ITemplateContentItem {
  type: EContentType.CONTAINER;
}

// The container type is used to place any content in a div with specified height and width.
// It is the responsability of the user to ensure this content is safe.
export const Container =
  (content: ElementTypes, height: number, width: number, { id = 'MISSING_ID', style = {} } = {}) =>
  (settings: ISettings): IContainerItem => ({
    id,
    uid: getNextId(),
    type: EContentType.CONTAINER,
    content: processElement(content, settings),
    height,
    width,
    style: { ...style, ...(settings?.styleOverrides?.div || {}) },
  });
