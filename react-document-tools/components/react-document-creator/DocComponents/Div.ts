import { EContentType, ElementTypes, ISettings, ITemplateContentItem } from '../lib';
import { calculateCellHeightMultiType } from '../utils/calculateCellSize';
import { processElement } from '../utils/helpers';
import { getNextId } from '../utils/idGenerator';

export const processDivContent = (
  content: ElementTypes[] | ElementTypes | string,
  width,
  settings
) => {
  if (!content) return '';
  if (typeof content === 'string') {
    if (!content.includes('\n')) return content;
    return content.split('\n').map((t) => {
      /* eslint-ignore-next-line no-use-before-define */
      return Div(t, 'calculate', width)(settings);
    });
  }
  if (Array.isArray(content)) return content.map((c) => processDivContent(c, width, settings));
  return processElement(content, settings);
};

export interface IDivItem extends ITemplateContentItem {}

export interface DivArgs {
  align?: 'left' | 'center' | 'right';
  font?: string;
  style?: React.CSSProperties;
  padding?: number;
  id?: string;
}

export const Div =
  (
    content: ElementTypes | ElementTypes[] | string,
    height: number | 'auto' | 'calculate' = 'calculate',
    width: number | 'auto' = 'auto',
    { align = 'left', font = null, style = {}, padding = 0, id = 'MISSING_ID' }: DivArgs = {}
  ) =>
  (settings: ISettings): IDivItem => {
    const fontUsed = font || settings.defaultFont;
    const contentProcessed = processDivContent(content, width, settings);
    const heightCalculated =
      height === 'calculate'
        ? Math.max(
            settings.lineHeight,
            width === 'auto'
              ? 0
              : calculateCellHeightMultiType(contentProcessed, width, padding, fontUsed)
          )
        : height;
    return {
      id,
      uid: getNextId(),
      type: EContentType.DIV,
      content: contentProcessed,
      height: heightCalculated,
      width,
      align,
      style: { ...(settings?.styleOverrides?.div || {}), ...style },
      font: fontUsed,
    };
  };
