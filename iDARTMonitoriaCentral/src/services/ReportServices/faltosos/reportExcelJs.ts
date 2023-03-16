import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

export default {
  async downloadExcel() {
    const options = {
      filename: './streamed-workbook.xlsx',
      useStyles: true,
      useSharedStrings: true,
    };

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'LAB';
    workbook.lastModifiedBy = 'LAB';
    workbook.created = new Date(1985, 8, 30);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2016, 9, 27);

    // Force workbook calculation on load
    //workbook.calcProperties.fullCalcOnLoad = true;

    const worksheet = workbook.addWorksheet('My Sheet');

    //worksheet.autoFilter = 'A1:C1';
    // worksheet.columns = [
    //   { header: 'Id', key: 'id', width: 10 },
    //   { header: 'Name', key: 'name', width: 32 },
    //   { header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 },
    // ];

    // Add a row by contiguous Array (assign to columns A, B & C)
    // for (let index = 0; index < 10; index++) {
    //   worksheet.addRow([index, 'Tiago', new Date()]);
    // }

    // merge a range of cells
    //worksheet.mergeCells('A4:B5');

    // Insert a row by contiguous Array (assign to columns A, B & C)
    // worksheet.insertRow(14, [3, 'Sam', new Date()]);

    worksheet.addTable({
      name: 'MyTable',
      ref: 'B14',
      headerRow: true,
      totalsRow: true,
      style: {
        theme: 'TableStyleDark3',
        showRowStripes: true,
      },
      columns: [
        { name: 'Date', totalsRowLabel: 'Totals:', filterButton: true },
        { name: 'Amount', totalsRowFunction: 'sum', filterButton: false },
      ],
      rows: [
        [new Date('2019-07-20'), 70.1],
        [new Date('2019-07-21'), 70.6],
        [new Date('2019-07-22'), 70.1],
      ],
    });

    const fileName = 'sample.xlsx';

    const buffer = await workbook.xlsx.writeBuffer();
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileExtension = '.xlsx';

    const blob = new Blob([buffer], { type: fileType });

    saveAs(blob, fileName + fileExtension);
  },
};
