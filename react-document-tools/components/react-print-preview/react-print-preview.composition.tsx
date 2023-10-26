import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { PrintPreview } from './react-print-preview';
import demoData from './demoData';

export const defaultPrintPreview = () => (
  <div
    style={{
      height: '2000px',
    }}
  >
    <PrintPreview pages={demoData} pageHeight={100} pageWidth={30} />
  </div>
);

export const fullExample = () => {
  const content = React.useRef(null);

  const print = useReactToPrint({
    content: () => content.current,
    copyStyles: true,
  });

  return (
    <div
      style={{
        height: '2000px',
      }}
    >
      <button type="button" className="button-one" onClick={print}>
        Print
      </button>
      <div ref={content}>
        <style>
          {`
@page {
  size: a4;
}
`}
        </style>
        <div
          className="printPreview_content-a4"
          style={{ pageBreakAfter: 'always', height: '200mm' }}
        >
          Hello
        </div>
        <div
          className="printPreview_content-a4"
          style={{ pageBreakAfter: 'always', height: '200mm' }}
        >
          Hello
        </div>
        <div
          className="printPreview_content-a4"
          style={{ pageBreakAfter: 'always', height: '200mm' }}
        >
          Hello
        </div>
      </div>
    </div>
  );
};
