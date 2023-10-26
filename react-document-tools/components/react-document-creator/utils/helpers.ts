import { AnyTemplateComponentType, P } from '../DocComponents';
import {
  ElementTypes,
  ISettings,
  // AllElementTypes,
  ITemplate,
  ITemplateProcessed,
  // AllElementTypesProcessed,
} from '../lib';

export const processElement = (
  element: ElementTypes,
  settings: ISettings
): AnyTemplateComponentType => {
  if (!settings) throw Error('Settings is undefined');
  if (typeof element === 'function') return element(settings);
  if (typeof element === 'string') return P(element)(settings);
  if (Array.isArray(element)) {
    throw Error('processElement: Array is not supported.');
  }
  return element;
};

export const processContent = (
  content: ElementTypes[],
  settings: ISettings
): AnyTemplateComponentType[] => {
  return content?.map((c) => processElement(c, settings));
};

export const processBody = (body, settings) => ({
  ...body,
  content: processContent(body.content, settings),
});

export const processTemplate = (template: ITemplate, settings: ISettings): ITemplateProcessed => {
  const header =
    template.header &&
    template.header({
      date: 'unknown',
      pageNo: -1,
      pageCount: -1,
    });
  const footer =
    template.footer &&
    template.footer({
      date: 'unknown',
      pageNo: -1,
      pageCount: -1,
    });
  return {
    header: header
      ? {
          ...header,
          content: processContent(header.content, settings),
        }
      : null,
    footer: footer
      ? {
          ...footer,
          content: processContent(footer.content, settings),
        }
      : null,
    body: template.body
      ? {
          ...template.body,
          content: processContent(template.body.content, settings),
        }
      : null,
  };
};

export const getFontString = (
  weight: number,
  textHeight: number,
  lineHeight: number,
  fontFamily: string
) => `${weight} ${textHeight.toFixed(0)}mm/${lineHeight}mm  ${fontFamily}`;

export const calcLineHeight = (textHeight: number) => textHeight * (5 / 3.8);
