import { EContentType, ISettings, ITemplateContentItem } from '../lib';
import { getNextId } from '../utils/idGenerator';

export interface IHItem extends ITemplateContentItem {}

export interface IHArgs {
  align?: 'left' | 'center' | 'right';
  font?: string;
  style?: React.CSSProperties;
  id?: string;
}

export const H1 =
  (text: string, { align = 'left', font = null, style = {}, id = 'MISSING_ID' }: IHArgs = {}) =>
  (settings: ISettings): IHItem => ({
    id,
    uid: getNextId(),
    type: EContentType.H1,
    text,
    height: settings.headingHeight,
    align,
    style: { ...style, ...(settings?.styleOverrides?.h1 || {}) },
    font: font || settings.defaultHeadingFont,
  });

export const H =
  (
    text: string,
    level: 1 | 2 | 3 | 4 = 1,
    { align = 'left', font = null, style = {}, id = 'MISSING_ID' }: IHArgs = {}
  ) =>
  (settings: ISettings): IHItem => {
    const styleH =
      (level === 1 && settings?.styleOverrides?.h1) ||
      (level === 2 && settings?.styleOverrides?.h2) ||
      (level === 3 && settings?.styleOverrides?.h3) ||
      (level === 4 && settings?.styleOverrides?.h4) ||
      {};
    return {
      id,
      uid: getNextId(),
      type: `h${level}` as EContentType.H1 | EContentType.H2 | EContentType.H3 | EContentType.H4,
      text,
      height: settings.headingHeight,
      align,
      style: { ...style, ...styleH },
      font: font || settings.defaultHeadingFont,
    };
  };
