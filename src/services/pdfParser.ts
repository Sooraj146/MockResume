import * as pdfjsLib from 'pdfjs-dist';

// Set up pdf.js worker URL dynamically
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export interface ExtractedPdfContent {
  text: string;
  pageCount: number;
}

export async function parsePdfFile(
  file: File,
  onProgress?: (percent: number, stageText: string) => void
): Promise<ExtractedPdfContent> {
  try {
    if (onProgress) onProgress(10, 'Loading PDF binary buffer...');
    const arrayBuffer = await file.arrayBuffer();

    if (onProgress) onProgress(18, 'Initializing PDF.js engine...');
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;

    const pageCount = pdfDocument.numPages;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      if (onProgress) {
        const pagePercent = Math.round(20 + (pageNum / pageCount) * 20);
        onProgress(pagePercent, `Extracting text from page ${pageNum} of ${pageCount}...`);
      }

      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Sort items by vertical position (Y descending) and horizontal position (X ascending)
      // for natural reading order in multi-column resumes
      const items = textContent.items as Array<{
        str: string;
        transform: number[];
        width: number;
        height: number;
        hasEOL?: boolean;
      }>;

      if (items.length === 0) continue;

      let lastY: number | null = null;
      let pageLines: string[] = [];
      let currentLine: string[] = [];

      for (const item of items) {
        const textStr = item.str;
        if (!textStr) continue;

        const currentY = item.transform ? Math.round(item.transform[5]) : null;

        if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
          // New line detected
          if (currentLine.length > 0) {
            pageLines.push(currentLine.join(' '));
            currentLine = [];
          }
        }

        currentLine.push(textStr);
        if (currentY !== null) {
          lastY = currentY;
        }
      }

      if (currentLine.length > 0) {
        pageLines.push(currentLine.join(' '));
      }

      fullText += pageLines.join('\n') + '\n\n';
    }

    const trimmedText = fullText.trim();
    if (!trimmedText || trimmedText.length < 20) {
      throw new Error(
        'No readable text could be extracted from this PDF. It may be a scanned image PDF or password protected.'
      );
    }

    if (onProgress) onProgress(45, 'PDF text & layout successfully decoded!');

    return {
      text: trimmedText,
      pageCount,
    };
  } catch (error: any) {
    console.error('PDF parsing error:', error);
    if (error.message && error.message.includes('No readable text')) {
      throw error;
    }
    throw new Error(
      error.message || 'Failed to parse PDF file. Please ensure it is a valid, unencrypted PDF.'
    );
  }
}
