import {
  AnyTemplateComponentType,
  IDivItem,
  IFullPageItem,
  IPageBreakItem,
  ITableItem,
  PageBreak,
} from '../DocComponents';
import {
  EContentType,
  IPageOptions,
  ISettings,
  ITemplateBodyProcessed,
} from '../lib';
import { splitTableBetweenPages } from './tableUtils';

const defaultPageOptions: Partial<IPageOptions> = {
  includeHeader: true,
  includeFooter: true,
};

export type PageAggregation = [
  newNumberOfPages: number,
  newRemainingBodyHeight: number,
  newPageTemplates: unknown[][],
  newPageOptions: Partial<IPageOptions>[]
];

export const splitBetweenPages = (
  item: IDivItem,
  remainingBodyHeight: number,
  bodyHeight
): AnyTemplateComponentType[] => {
  if (
    !item.content ||
    item.height === 'auto' ||
    remainingBodyHeight > item.height
  )
    return [item];
  if (Array.isArray(item.content)) {
    //
    const [divsOut] = item.content?.reduce(
      ([_divsOut, _remainingBodyHeight], _content, i) => {
        if (
          _content.height !== 'auto' &&
          _content.height > _remainingBodyHeight
        ) {
          // Handle add page breakreturn
          return [[..._divsOut, _content], _remainingBodyHeight];
        }
        return [[..._divsOut, _content], _remainingBodyHeight];
      },
      [[] as AnyTemplateComponentType[], remainingBodyHeight]
    );
    return divsOut;
  }
  return [item];
};

export const addToPages = (
  settings: ISettings,
  data: Object,
  item: AnyTemplateComponentType,
  bodyHeight: number,
  acc: PageAggregation,
  pageOptions: Partial<IPageOptions> = defaultPageOptions
): PageAggregation => {
  const [
    numberOfPages,
    remainingBodyHeight,
    currPageTemplates,
    allPageOptions,
  ] = acc;
  /* @ts-ignore */
  if (item.height === 'auto') {
    // TODO: This may not always be the case
    throw new Error('Should have calculated height first');
  }
  const contentExceedsPageHeight = item.height > remainingBodyHeight;
  if (item.height > bodyHeight) {
    throw Error(
      `[${item.id}]Item height(${item.height}) is greater than body height(${bodyHeight})`
    );
  }
  if (item.height <= 0) {
    return acc;
  }
  const newNumberOfPages = contentExceedsPageHeight
    ? numberOfPages + 1
    : numberOfPages;
  const newRemainingBodyHeight = contentExceedsPageHeight
    ? bodyHeight - item.height
    : remainingBodyHeight - item.height;
  const newPageTemplates = contentExceedsPageHeight
    ? [...currPageTemplates, [item]]
    : [
        ...currPageTemplates.slice(0, currPageTemplates.length - 1),
        [...currPageTemplates.slice(currPageTemplates.length - 1)[0], item],
      ];
  const newPageOptions = contentExceedsPageHeight
    ? [...allPageOptions, { ...defaultPageOptions, ...pageOptions, bodyHeight }]
    : allPageOptions;
  return [
    newNumberOfPages,
    newRemainingBodyHeight,
    newPageTemplates,
    newPageOptions,
  ];
};

/**
 * compile the body template with the data then split into pages
 */
export const calculatePages = (
  settings: ISettings,
  data,
  bodyTemplate: ITemplateBodyProcessed,
  bodyHeight: number,
  pageHeight: number,
  pageOptions: IPageOptions,
  initialState: PageAggregation = [0, 0, [], []]
  // initialState = [1, bodyHeight, [[]], [{ ...defaultPageOptions, bodyHeight }]]
): PageAggregation => {
  // TODO: Make sure to add page height
  return bodyTemplate.content.reduce(
    (acc: PageAggregation, item) => {
      if (Array.isArray(item)) {
        throw new Error('Handle arrays');
      }
      if (typeof item === 'string') {
        throw new Error('Handle string elements in preprocessing');
      }
      if (typeof item.height === 'string') {
        // throw new Error('Handle string height in preprocessing');
      } else if (item.height <= 0) {
        return acc;
      }
      const [currNoPages, remainingBodyHeight] = acc;
      if (item.type === EContentType.TABLE) {
        // if the item is a table we need to split it between pages
        // const remainingBodyHeight = bodyHeight - currentContentHeight;
        const tables = splitTableBetweenPages(
          item as ITableItem,
          remainingBodyHeight,
          bodyHeight,
          settings
        );
        return tables.reduce((tacc, table) => {
          const out = addToPages(
            settings,
            data,
            table,
            bodyHeight,
            tacc,
            pageOptions
          );
          return out;
        }, acc);
      }

      if (item.type === EContentType.PAGEBREAK) {
        const itemMod = {
          ...(item as IPageBreakItem),
          height: remainingBodyHeight,
        };
        return remainingBodyHeight > 0 && currNoPages > 0
          ? addToPages(settings, data, itemMod, bodyHeight, acc, pageOptions)
          : acc;
      }

      if (item.type === EContentType.FULL_PAGE) {
        /* Add a page break to end previous page */
        const additionalPageBreak = {
          uid: `${item.uid}_prev_break`,
          type: EContentType.PAGEBREAK,
          id: 'Additional Page Break',
        };
        const pageBreak = {
          ...additionalPageBreak,
          height: remainingBodyHeight,
        };
        const accWithPageBreak =
          remainingBodyHeight > 0
            ? addToPages(
                settings,
                data,
                pageBreak,
                bodyHeight,
                acc,
                pageOptions
              )
            : acc;
        // TODO: Calculate number of full page pages.
        // TODO: Store is full page in accumulator
        // const fullPagePages = calculatePages(options, data, bodyTemplate, pageHeight, pageHeight);

        const pageOptionsFull = {
          ...pageOptions,
          includeHeader: false,
          includeFooter: false,
        };
        const accPlusFullPageContent = calculatePages(
          settings,
          data,
          item as IFullPageItem,
          pageHeight,
          pageHeight,
          pageOptionsFull,
          accWithPageBreak
        );
        const remainingBodyHeightEnd = accPlusFullPageContent[1];
        const pageBreakEnd = {
          ...additionalPageBreak,
          height: remainingBodyHeightEnd,
        };
        const accPlusPageBreakEnd =
          remainingBodyHeightEnd > 0
            ? addToPages(
                settings,
                data,
                pageBreakEnd,
                pageHeight,
                accPlusFullPageContent,
                pageOptionsFull
              )
            : accPlusFullPageContent;

        return accPlusPageBreakEnd;
      }
      if (item.type === EContentType.DIV) {
        const divs = splitBetweenPages(
          item as IDivItem,
          remainingBodyHeight,
          bodyHeight
        );

        return divs.reduce((tacc, div) => {
          const out = addToPages(
            settings,
            data,
            div,
            bodyHeight,
            tacc,
            pageOptions
          );
          return out;
        }, acc);
      }
      // For all other types just add to pages
      return addToPages(settings, data, item, bodyHeight, acc, pageOptions);
    },
    // TODO: Initial page options will be different if first page is a full page
    initialState
  );
  // return [totalNumberOfPages, pageTemplates, finalRemainingHeight, allPageOptions];
};

export const pagesToBodyContent = (
  pageIds,
  dataLoaders,
  templateBuilders,
  settings
) => {
  return pageIds.reduce((content, pageid) => {
    const pageData = dataLoaders[pageid](settings);
    const pageContent = templateBuilders[pageid](settings, pageData);
    const newContent = [...content, ...pageContent, PageBreak()];
    return newContent;
  }, []);
};
