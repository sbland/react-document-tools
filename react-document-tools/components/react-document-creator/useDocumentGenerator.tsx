import React from 'react';
import { Page } from '@react-document-tools/components.react-print-preview';
import { jsonToDom } from './Converters/domConverter';
import { jsonToDocX, saveDocx } from './Converters/docxConverter';
import { calculatePages } from './utils/processContent';
import { ISettings, ITemplate } from './lib';
import { calculateBodyDimensions } from '@react-document-tools/utils.size-checks';
import { processContent } from './utils/helpers';

export interface IUseDocumentGeneratorArgs<Data> {
  settings: ISettings;
  data?: Data;
  template: ITemplate;
  date?: Date;
}
export interface IUseDocumentGeneratorReturn {
  exportDocX: () => void;
  pages: Page[];
}

export const useDocumentGenerator = <Data = never,>({
  settings,
  data,
  template,
  date,
}: IUseDocumentGeneratorArgs<Data>): IUseDocumentGeneratorReturn => {
  const { height: bodyHeight, pageHeight } = calculateBodyDimensions(settings);
  const [, , pageTemplates, pageOptions] = calculatePages(
    settings,
    data,
    { content: processContent(template.body?.content, settings) },
    bodyHeight,
    pageHeight,
    { ...settings }
  );
  const pageCount = pageTemplates.length;
  const dateFormatted = date
    ? Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(date)
    : Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(Date.now());

  const pagesCompiled = pageTemplates.map(
    (content, i) =>
      new Page(
        i,
        (
          <div
            data-testid="docGen-page"
            className="page"
            style={{ height: `${settings.paperHeight}mm` }}
          >
            {jsonToDom(
              {
                header: template.header && {
                  ...template.header,
                  content: processContent(
                    template.header({
                      date: dateFormatted,
                      pageNo: i + 1,
                      pageCount,
                    }).content,
                    settings
                  ),
                },
                body: { content },
                footer: template.footer && {
                  ...template.footer,
                  content: processContent(
                    template.footer({
                      date: dateFormatted,
                      pageNo: i + 1,
                      pageCount,
                    }).content,
                    settings
                  ),
                },
              },
              pageOptions[i].bodyHeight || bodyHeight,
              pageOptions[i],
              settings
            )}
          </div>
        )
      )
  );
  const exportDocX = () => {
    const doc = jsonToDocX(template);
    saveDocx(doc);
  };
  return {
    exportDocX,
    pages: pagesCompiled,
  };
};
