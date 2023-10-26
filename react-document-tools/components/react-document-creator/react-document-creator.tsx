import React from 'react';
import {
  PrintPreview,
  IPrintPreviewProps,
} from '@react-document-tools/components.react-print-preview';
// import { wrapWithErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { useDocumentGenerator } from './useDocumentGenerator';
import { ISettings, ITemplate } from './lib';

export interface IDocumentGeneratorProps {
  settings: ISettings;
  data: any;
  template: ITemplate;
  printPreviewProps?: Partial<IPrintPreviewProps>;
}

export const DocumentGenerator: React.FC<IDocumentGeneratorProps> = ({
  settings,
  data,
  template,
  printPreviewProps = {},
}) => {
  const { exportDocX, pages } = useDocumentGenerator({
    settings,
    data,
    template,
  });
  const { paperWidth, paperHeight } = settings;
  return (
    <div className="documentGenerator_wrap" style={{ height: '100vh' }}>
      <button type="button" className="button-one" onClick={exportDocX}>
        Export as Docx
      </button>
      <PrintPreview
        pages={pages}
        pageWidth={paperWidth}
        pageHeight={paperHeight}
        {...printPreviewProps}
      />
    </div>
  );
};

// export const DocumentGeneratorErrorWrapped = wrapWithErrorBoundary(
//   DocumentGenerator,
//   'Data Table failed to render',
//   () => {}
// );

export default DocumentGenerator;
