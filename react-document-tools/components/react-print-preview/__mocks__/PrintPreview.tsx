// We mock popup panels
import React from 'react';
import flatten from 'lodash/flatten';

const PrintPreview = ({ pages }) => {
  const pagesFlattened = flatten(pages);
  return <div className="printPreview">{pagesFlattened.map((page: any) => page.page)}</div>;
};

export default PrintPreview;
