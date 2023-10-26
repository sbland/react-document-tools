import { EFilterType, Uid } from '@react_db_client/constants.client-types';
import {
  ElementTypes,
  EContentType,
  IHeading,
  ISettings,
  ITemplateContentItem,
} from '../lib';
import {
  calculateTableColumnWidths,
  calculateTableRowHeight,
  calculateTableRowHeights,
} from '../utils/calculateCellSize';
import { processContent, processElement } from '../utils/helpers';

import { getNextId } from '../utils/idGenerator';
import { Div } from './Div';
import { IImgItem, Img } from './Img';
import { P } from './P';
import { AnyTemplateComponentType } from '.';

export interface ITableProps {
  id: Uid;
  columnWidths: number[] | 'calculate';
  rowHeights: number[] | 'calculate';
  content: ElementTypes[][];
  headings?: ElementTypes[];
  headingsMeta?: IHeading[];
  headingsHeight?: number | 'calculated';
  headingsMargin?: number;
  maxWidth?: number;
  cellPadding?: number;
  uid: Uid;
  font?: string;
}

export interface ITableItem extends Omit<ITemplateContentItem, 'content'> {
  columnWidths: number[];
  rowHeights: number[];
  content: AnyTemplateComponentType[][];
  headings: AnyTemplateComponentType[] | null;
  headingsHeight: number;
  headingsMargin: number;
  cellPadding: number;
  height: number;
}

// TODO: add heading border padding
export const Table =
  ({
    id,
    columnWidths,
    rowHeights,
    content,
    headings,
    headingsMeta,
    headingsHeight,
    headingsMargin,
    maxWidth,
    cellPadding = 0,
    uid,
    font,
  }: ITableProps) =>
  (settings: ISettings): ITableItem => {
    if (!settings) throw Error('Settings is undefined');
    const idInUse = id || uid || 'MISSING ID';
    const fontInUse = font || settings.defaultFont;
    const headingsHeightInUse =
      headingsHeight == null ? settings.headingHeight : headingsHeight;
    const headingsMarginInUse =
      headingsMargin == null ? settings.tableHeadingsMargin : headingsMargin;
    const headingsActivated = headings
      ? processContent(headings, settings)
      : null;
    const contentActivated = content.map(
      (row) => row.map((c) => processElement(c, settings))
      // row.map((c) => (typeof c === 'function' ? c(settings) : c))
    );

    const columnWidthsCalculated =
      columnWidths === 'calculate'
        ? calculateTableColumnWidths(
            contentActivated,
            headingsMeta || [],
            maxWidth as number
          )
        : columnWidths;

    const calculateHeadingsHeight = () => {
      if (!headingsActivated) return 0;
      try {
        return headingsHeightInUse === 'calculated'
          ? calculateTableRowHeight(
              headingsActivated,
              columnWidthsCalculated,
              cellPadding,
              settings.defaultHeadingFont,
              settings
            )
          : headingsHeightInUse;
      } catch (error) {
        console.log(headingsActivated);
        console.log(error);
        throw Error(
          `Failed to calculate headings height for table: ${idInUse} with error: ${error}`
        );
      }
    };

    const rowHeightsCalculated =
      rowHeights === 'calculate'
        ? calculateTableRowHeights(
            contentActivated,
            columnWidthsCalculated,
            cellPadding,
            fontInUse,
            settings
          )
        : rowHeights;
    const width = columnWidthsCalculated.reduce((acc, v) => acc + v, 0);
    const headingsHeightCalculated = calculateHeadingsHeight();
    const height =
      rowHeightsCalculated.reduce((acc, v) => acc + v, 0) +
      headingsHeightCalculated +
      headingsMarginInUse;

    return {
      id: idInUse,
      uid: uid || getNextId(),
      type: EContentType.TABLE,
      height,
      width,
      columnWidths: columnWidthsCalculated,
      rowHeights: rowHeightsCalculated,
      content: contentActivated,
      headings: headingsActivated || null,
      headingsHeight: headingsHeightCalculated,
      headingsMargin: headingsMarginInUse || 0,
      cellPadding,
      font: font || settings.defaultFont,
    };
  };

export const TableCell =
  (
    value: ElementTypes | ElementTypes[] | undefined | null,
    width: number | 'auto',
    height: number | 'auto',
    type: EFilterType | 'mixed' = EFilterType.text,
    cellPadding = 0,
    cellOptions = {}
  ) =>
  (settings: ISettings): AnyTemplateComponentType => {
    const heightPadded =
      (height === 'auto' && height) ||
      (height && (height as number) - cellPadding * 2);
    const widthPadded =
      (width === 'auto' && width) ||
      (width && (width as number) - cellPadding * 2);
    if (!value) return P('')(settings);
    switch (type) {
      case EFilterType.text:
        return P((value as string) || '', cellOptions)(settings);
      case EFilterType.textLong:
        return Div(value, heightPadded, widthPadded, cellOptions)(settings);
      case EFilterType.number:
        return P(`${value}`, { align: 'right', ...cellOptions })(settings);
      case EFilterType.image: {
        const v = value as IImgItem & { filePath?: string; label?: string };
        const src = v?.src || v?.filePath;
        const altText = v?.altText || v.label || '';
        return Img(
          src ? `${settings.fileServerUrl}/${src}` : '',
          widthPadded,
          heightPadded,
          altText,
          cellOptions
        )(settings);
      }
      case 'mixed':
        // TODO: Check this works ok
        // TODO: should this be container instead of div?
        return Div(value)(settings);
      default:
        return P('Invalid type')(settings);
    }
  };
