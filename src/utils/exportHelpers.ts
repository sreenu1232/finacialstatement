import { saveAs } from 'file-saver';
// @ts-ignore - html-to-docx doesn't have type definitions
import HTMLtoDOCX from 'html-to-docx';

export const exportToWord = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  // Clone the element to modify it for export without affecting the UI
  const clone = element.cloneNode(true) as HTMLElement;

  // Remove any elements that shouldn't be in the report (like buttons, validation dashboard)
  const noPrintElements = clone.querySelectorAll('.print\\:hidden');
  noPrintElements.forEach(el => el.remove());

  // Get the HTML content
  // We need to wrap it in a full HTML structure for the converter to work best
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Financial Report</title>
      <style>
        body { font-family: 'Times New Roman', serif; }
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid #000; padding: 4px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .page-break-after { page-break-after: always; }
      </style>
    </head>
    <body>
      ${clone.innerHTML}
    </body>
    </html>
  `;

  try {
    // html-to-docx converts HTML string to a Buffer/Blob
    // Parameters: htmlString, headerHTMLString, documentOptions, footerHTMLString
    const fileBuffer = await HTMLtoDOCX(htmlContent, null, {
      orientation: 'portrait',
      margins: { 
        top: 720, 
        right: 720, 
        bottom: 720, 
        left: 720 
      }, // Twips (1/1440 inch)
      table: { row: { cantSplit: true } },
    });

    // Convert Buffer to Blob if needed, or use directly
    const blob = fileBuffer instanceof Blob ? fileBuffer : new Blob([fileBuffer]);
    saveAs(blob, `${filename}.docx`);
  } catch (error) {
    console.error('Error generating Word document:', error);
    alert('Failed to generate Word document. Please check the console for details.');
  }
};
