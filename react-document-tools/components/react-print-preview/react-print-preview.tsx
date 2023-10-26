import React, { useState, useRef, useMemo, ReactInstance } from 'react';
import PropTypes from 'prop-types';
import flatten from 'lodash/flatten';
import ReactToPrint from 'react-to-print';
import Page from './PageClass';
import './_printPreview.scss';

export interface IPrintPreviewProps {
  pages: Page[];
  startZoom?: number;
  pageHeight: number;
  pageWidth: number;
  onPrintError?: (
    errLoc: 'onBeforeGetContent' | 'onBeforePrint' | 'print',
    err: Error
  ) => void;
}

export const PrintPreview: React.FC<IPrintPreviewProps> = ({
  pages,
  startZoom = 1,
  pageHeight,
  pageWidth,
  onPrintError = () => {},
}) => {
  // componentRef indicates the component to be printed
  const componentRef = useRef<ReactInstance>();

  // navigation state
  const [zoom, setZoom] = useState<number>(startZoom);
  const [manualEditPageNo, setManualEditPageNo] = useState(1);

  const pagesFlattened = flatten(pages);
  const pageCount = pagesFlattened.length;

  const handleNextPage = () => {
    if (manualEditPageNo < pageCount) {
      setManualEditPageNo((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (manualEditPageNo > 1) {
      setManualEditPageNo((prev) => prev - 1);
    }
  };

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 10);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 20) {
      setZoom(zoom + 10);
    }
  };

  const updateManualPageNo = (e) => {
    const v = parseInt(e.target.value);
    if (!isNaN(v)) {
      setManualEditPageNo(v);
    } else {
      setManualEditPageNo(1);
    }
  };

  const activePage = useMemo(() => {
    const v = manualEditPageNo; //Number.parseInt(manualEditPageNo);
    if (!Number.isNaN(v) && 1 <= v && v <= pageCount) {
      return v - 1;
    } else {
      return 0;
    }
  }, [pageCount, manualEditPageNo]);

  const handleKeyPressPageNo = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      handleNextPage();
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePreviousPage();
    }
  };

  return (
    <>
      <div className="printPreview">
        <div className="printPreview_btns">
          <button
            type="button"
            className="button-one printPreview_navLeftBtn"
            onClick={handlePreviousPage}
          >
            {'<'}
          </button>
          <div className="printPreview_pageNoWrap">
            Page:
            <div>
              <input
                type="text"
                name="manualPageInput"
                className="printPreview_pageNoInput"
                onChange={updateManualPageNo}
                onKeyDown={handleKeyPressPageNo}
                value={Number.isNaN(manualEditPageNo) ? '' : manualEditPageNo}
              />
              /{pageCount}
            </div>
          </div>
          <button
            type="button"
            className="button-one printPreview_navRightBtn"
            onClick={handleNextPage}
          >
            {'>'}
          </button>
          <div />
          <button
            type="button"
            className="button-one printPreview_navZoomInBtn"
            onClick={handleZoomIn}
          >
            +
          </button>
          <span>{zoom}%</span>
          <button
            type="button"
            className="button-one  printPreview_navZoomOutBtn"
            onClick={handleZoomOut}
          >
            -
          </button>
          <ReactToPrint
            trigger={() => (
              <button
                type="button"
                className="button-one printPreview_printBtn"
              >
                Print
              </button>
            )}
            content={() => componentRef.current as ReactInstance}
            onPrintError={(errLoc, err) => {
              if (onPrintError) onPrintError(errLoc, err);
              else {
                // TODO send to notification bar
                console.info('FAILED TO PRINT!');
                console.info(errLoc);
                console.info(err);
                alert('Failed to print!');
              }
            }}
          />
        </div>
        <div
          className="printPreview_contentWrap"
          style={{
            minHeight: `${pageHeight * 1.2 * (zoom / 100)}mm`,
          }}
        >
          <div
            className="printPreview_zoomWrap"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: '0% 0% 0px',
            }}
          >
            <div
              className="printPreview_content-A4"
              id="print_content"
              data-testid="print_content"
              style={{
                width: `${pageWidth}mm`,
                height: `${pageHeight}mm`,
              }}
            >
              {(pagesFlattened && pagesFlattened[activePage]?.page) ||
                'INVALID PAGE'}
            </div>
          </div>
        </div>
      </div>
      {/* NOTE: The below is hidden to user but is used for printing */}
      <div
        ref={componentRef as React.RefObject<HTMLDivElement>}
        className="printPreview_allPagesForPrint"
      >
        {pagesFlattened &&
          pagesFlattened.map((page) => (
            <div
              // key={JSON.stringify(page)}
              className="printPreview_content-A4"
              id="print_content"
              key={page.uid}
              style={{
                width: `${pageWidth}mm`,
                height: `${pageHeight}mm`,
              }}
            >
              {page ? page.page : 'INVALID PAGE'}
            </div>
          ))}
      </div>
    </>
  );
};

PrintPreview.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.instanceOf(Page)).isRequired,
  startZoom: PropTypes.number,
  pageWidth: PropTypes.number,
  pageHeight: PropTypes.number,
};

PrintPreview.defaultProps = {
  startZoom: 100,
  pageWidth: 210,
  pageHeight: 296,
};

export default PrintPreview;
