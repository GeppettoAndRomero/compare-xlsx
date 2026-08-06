import type { ToolContent } from './types';

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'Compare Excel Files Cell by Cell in Your Browser — No Upload | runlocally',
    description:
      'Compare two XLSX, XLSM, or XLS workbooks by sheet name, row number, and column position. Review changed cell values in your browser without uploading either file.',
    ogTitle: 'Compare Excel Workbooks Cell by Cell — No Upload',
    ogDescription:
      'Find cell value differences between two Excel workbooks in your browser. Files stay on your device.',
  },

  hero: {
    h1: 'Compare Excel Workbooks',
    tagline:
      'Compare two XLSX, XLSM, or XLS files by sheet name and cell position. Nothing is uploaded.',
  },

  intro: {
    h2: 'A focused, cell-by-cell workbook comparison',
    paras: [
      'Choose two Excel workbooks and this tool compares sheets whose names match exactly. Within each matched sheet, rows are paired by row number and cells by column position. The result lists only changed cells, along with a per-sheet count of matching rows and different cells.',
      'This MVP compares cell values after converting them to text. Number formats, colors, fonts, borders, column widths, comments, and other formatting are ignored. Sheets found in only one workbook are listed separately; they are not matched by similarity.',
    ],
  },

  privacy: {
    h2: 'Workbook data stays in this browser',
    lead:
      'Both files are read on your device. The comparison has no upload step and no server-side workbook processor:',
    points: [
      'Workbook parsing and comparison run in your browser.',
      'Only the two files you choose are read; the original files are not modified.',
      'JSON and CSV exports contain the comparison result, not a merged workbook.',
      'The source is available under the MIT license for inspection.',
    ],
    note:
      'You can verify the local workflow in your browser’s Network panel while comparing: no request carries either workbook.',
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to compare two workbooks',
    steps: [
      {
        h3: 'Choose File A and File B',
        p: 'Select one XLSX, XLSM, or XLS workbook for each side. You can also drop exactly two workbooks on the page.',
      },
      {
        h3: 'Compare matching sheets',
        p: 'Start the comparison. Sheets with identical names are checked at the same row and column positions.',
      },
      {
        h3: 'Review or export differences',
        p: 'Inspect the changed cells, filter the list, and export the result as JSON or CSV if needed.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Are my Excel files uploaded?',
      a: 'No. Both workbooks are parsed and compared in your browser. There is no server-side comparison endpoint, and the original files are not modified.',
    },
    {
      q: 'How are rows matched?',
      a: 'Rows are matched only by their row number. For example, row 12 in File A is compared with row 12 in File B. A moved or inserted row can therefore produce several reported differences. Key-column and moved-row matching are outside this MVP.',
    },
    {
      q: 'What happens when sheet names differ?',
      a: 'Only sheet names that match exactly are compared. A differently named sheet is listed as existing only in File A or only in File B. The tool does not guess whether two differently named sheets correspond.',
    },
    {
      q: 'Does it compare formulas and formatting?',
      a: 'It compares the cell values read from the workbook after converting them to text. Formula text and visual formatting such as colors, fonts, borders, and number formats are not compared.',
    },
    {
      q: 'Can it compare XLSM files safely?',
      a: 'XLSM files can be read for comparison. Macros are not executed. This tool does not write or merge either workbook.',
    },
    {
      q: 'Can it merge the differences?',
      a: 'No. The result is read-only. Merging, patching, editing, comparisons with three or more files, and manual sheet pairing are outside the current scope.',
    },
    {
      q: 'What limits the workbook size?',
      a: 'The browser reads each workbook into memory, so the practical limit depends on available device memory and workbook structure. Larger workbooks can keep the page busy while they are parsed.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      'Built and maintained by Geppetto. Some code is written with AI assistance; review and decisions remain with the maintainer.',
    securityText: 'Security',
  },

  related: {
    h2: 'Related tools',
    blogLinkText: 'Read the technical notes',
  },
};
