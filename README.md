# compare-xlsx

Compare two XLSX, XLSM, or XLS workbooks in the browser. Files are matched by
sheet name, then cells are compared at the same row and column positions. The
workbooks are not uploaded.

Part of [runlocally](https://runlocally.app) — small tools that run locally on
your device.

## Comparison model

- Exactly two workbooks
- Only sheets with identical names are compared
- Rows are aligned by row number; columns are aligned by position
- Cell values are converted to strings before comparison
- Formatting, formula text, comments, and workbook structure are not compared
- Sheets found on only one side are listed separately
- Differences can be exported as JSON or CSV

Merging, editing, key-column matching, moved-row detection, and comparisons
with more than two files are outside the MVP.

## Development

```bash
npm run dev
npm run type-check
npm run lint
npm run test:unit
npm run build
```

The SheetJS module is loaded with a dynamic import after the user starts a
comparison and is emitted as a separate production chunk.

## License

[MIT](./LICENSE). Built and maintained by Geppetto. Some code is written with
AI assistance; review and decisions remain with the maintainer.
