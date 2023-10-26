import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PopupPanel } from '@react_db_client/components.popup-panel';
import { Emoji } from '@react_db_client/components.emoji';
import PrintPreview from './react-print-preview';
import Page from './PageClass';

export const PrintPreviewPanelManager = ({ pages }) => {
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  return (
    <>
      <button
        type="button"
        className="button-two openPrintPreviewBtn"
        onClick={() => setShowPrintPreview(true)}
        style={{ width: '2rem' }}
      >
        <Emoji emoj="🖨️" label="Print" />
      </button>
      <PopupPanel
        id="printPreviewPanel"
        isOpen={showPrintPreview}
        renderWhenClosed
        handleClose={() => setShowPrintPreview(false)}
      >
        <h2>Print Preview</h2>
        <div style={{ height: '95%' }}>
          <PrintPreview pages={pages} startZoom={100} />
        </div>
      </PopupPanel>
    </>
  );
};

PrintPreviewPanelManager.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.instanceOf(Page)).isRequired,
};

export default PrintPreviewPanelManager;
