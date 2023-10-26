import * as docx from 'docx';
import FileSaver from 'file-saver';

/* CONVERTERS */
export const objToDocx = (data) => {
  switch (data.type) {
    case 'p':
      return new docx.Paragraph({ text: data.text });
    case 'h1':
      return new docx.Paragraph({
        text: data.text,
        heading: docx.HeadingLevel.HEADING_1,
      });
    // case 'section':
    //   return new docx.Paragraph({ children: data.children.map(objToDocx) });
    default:
      return new docx.Paragraph({ text: 'INVALID JSON!' });
  }
};

export const jsonToDocX = (data) => {
  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: data.body.map(objToDocx),
        headers: data.header
          ? {
              default: new docx.Header({
                children: data.header.map(objToDocx),
              }),
            }
          : undefined,
        footers: data.footer
          ? {
              default: new docx.Header({
                children: data.footer.map(objToDocx),
              }),
            }
          : undefined,
      },
    ],
  });

  return doc;
};

export const saveDocx = (doc) =>
  docx.Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    FileSaver.saveAs(blob, 'example.docx');
    console.log('Document created successfully');
  });
