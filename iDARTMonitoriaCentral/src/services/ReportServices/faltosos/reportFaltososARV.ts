import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import reportService from '../reportService';
import { MOHIMAGELOG } from 'src/assets/imageBytes';

const logoTitle =
  'REPÚBLICA DE MOÇAMBIQUE \n MINISTÉRIO DA SAÚDE \n SERVIÇO NACIONAL DE SAÚDE';
const title = 'Lista de Pacientes de Pacientes Faltosos ao Levantamento';
const reportName = 'PacientesFaltososAoLevantamento';
const fileName = reportName.concat(
  '_' + reportService.getFormatDDMMYYYY(new Date())
);

export default {
  async downloadPDF(
    facility: string,
    province: string,
    startDate: string,
    endDate: string,
    params: Object
  ) {
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 'smart', // or "smart", default is 16
    });
    const image = new Image();
    image.src = '/src/assets/MoHLogo.png';
    const width = doc.internal.pageSize.getWidth();
    /*
      Fill Table
    */
    const cols = [
      'NID',
      'Nome',
      'Data do Último Levanatmento',
      'Data em que Faltou ao Levantamento',
      'Data em que Identificou o Abandono ao TARV [>59 dias faltosos]',
      'Farmácia de Referência',
      'Chamada Efectuada',
    ];
    const rows = await reportService.getPatientsWithMissDispenses(params);
    const data = [];

    for (const row in rows) {
      const createRow = [];
      createRow.push(rows[row].patientid);
      createRow.push(rows[row].fullname);
      createRow.push(reportService.getFormatDDMMYYYY(rows[row].lastpickupdate));
      createRow.push(reportService.getFormatDDMMYYYY(rows[row].nextpickupdate));
      createRow.push(
        rows[row].dataabandono !== null
          ? reportService.getFormatDDMMYYYY(rows[row].dataabandono)
          : '-'
      );
      createRow.push(rows[row].clinicname);
      createRow.push(rows[row].contact);

      data.push(createRow);
    }
    autoTable(doc, {
      margin: { top: 60 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 50 },
      },
      bodyStyles: {
        halign: 'center',
      },
      headStyles: {
        halign: 'center',
        valign: 'middle',
      },
      didDrawPage: function (data) {
        // Header
        doc.setFontSize(10);
        doc.setTextColor(40);
        doc.addImage(image, 'PNG', data.settings.margin.left + 15, 5, 25, 25);
        doc.text('REPÚBLICA DE MOÇAMBIQUE', data.settings.margin.left + 2, 35);
        doc.text('MINISTÉRIO DA SAÚDE', data.settings.margin.left + 7, 40);
        doc.text('SERVIÇO NACIONAL DE SAÚDE', data.settings.margin.left, 45);
        doc.setFontSize(16);
        doc.text(
          'Relatório de Pacientes Referidos e Faltosos ao',
          width / 2,
          35,
          {
            align: 'center',
          }
        );
        doc.text(
          'Levantamento de ARVs na Farmácia de Referência',
          width / 2,
          43,
          {
            align: 'center',
          }
        );
        doc.setFontSize(10);
        doc.text('Província: ' + province, width / 15, 57);
        doc.text('Data Início: ' + startDate, width / 2 + 98, 49);
        doc.text('Data Fim: ' + endDate, width / 2 + 98, 57);
        // doc.line(0, 35, 400, 50);
      },
      theme: 'grid',
      head: [cols],
      body: data,
    });
    params.value.loading.loading.hide();
    return doc.save('FaltososAoLevantamento.pdf');
  },

  async downloadExcel(
    facility: string,
    province: string,
    startDate: string,
    endDate: string,
    params: Object
  ) {
    const rows = await reportService.getPatientsWithMissDispenses(params);
    const data = this.createArrayOfArrayRow(rows);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'FGH';
    workbook.lastModifiedBy = 'FGH';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();

    // Force workbook calculation on load
    //workbook.calcProperties.fullCalcOnLoad = true;
    const worksheet = workbook.addWorksheet(reportName);
    const imageId = workbook.addImage({
      base64: 'data:image/png;base64,' + MOHIMAGELOG,
      extension: 'png',
    });
    // Get Cells
    const cellRepublica = worksheet.getCell('A8');
    const cellTitle = worksheet.getCell('A9');
    const cellPharm = worksheet.getCell('A11');
    const cellDistrict = worksheet.getCell('A12');
    const cellProvince = worksheet.getCell('D12');
    const cellStartDate = worksheet.getCell('G11');
    const cellEndDate = worksheet.getCell('G12');
    const cellPharmParamValue = worksheet.getCell('B11');
    const cellDistrictParamValue = worksheet.getCell('B12');
    const cellProvinceParamValue = worksheet.getCell('E12');
    const cellStartDateParamValue = worksheet.getCell('H11');
    const cellEndDateParamValue = worksheet.getCell('H12');

    // Get Rows
    const headerRow = worksheet.getRow(14);

    //Get Columns
    const colA = worksheet.getColumn('A');
    const colB = worksheet.getColumn('B');
    const colC = worksheet.getColumn('C');
    const colD = worksheet.getColumn('D');
    const colE = worksheet.getColumn('E');
    const colF = worksheet.getColumn('F');
    const colG = worksheet.getColumn('G');
    const colH = worksheet.getColumn('H');

    // Format Table Cells
    // Alignment Format
    cellRepublica.alignment =
      cellTitle.alignment =
      headerRow.alignment =
        {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };

    cellPharm.alignment =
      cellDistrict.alignment =
      cellProvince.alignment =
      cellStartDate.alignment =
      cellEndDate.alignment =
        {
          vertical: 'middle',
          horizontal: 'left',
          wrapText: false,
        };

    // Border Format
    cellRepublica.border =
      cellTitle.border =
      cellPharm.border =
      cellDistrictParamValue.border =
      cellDistrict.border =
      cellPharmParamValue.border =
      cellProvince.border =
      cellProvinceParamValue.border =
      cellStartDate.border =
      cellStartDateParamValue.border =
      cellEndDate.border =
      cellEndDateParamValue.border =
        {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

    // Assign Value to Cell
    cellRepublica.value = logoTitle;
    cellTitle.value = title;
    cellPharmParamValue.value = facility;
    cellProvinceParamValue.value = province;
    cellDistrictParamValue.value = '';
    cellStartDateParamValue.value = startDate;
    cellEndDateParamValue.value = endDate;
    cellPharm.value = 'Farmácia';
    cellDistrict.value = 'Distrito';
    cellProvince.value = 'Província';
    cellStartDate.value = 'Data Início';
    cellEndDate.value = 'Data Fim';

    // merge a range of cells
    worksheet.mergeCells('A1:A7');
    worksheet.mergeCells('A9:H10');
    worksheet.mergeCells('B11:F11');
    worksheet.mergeCells('B12:C12');
    worksheet.mergeCells('E12:F12');
    worksheet.mergeCells('A13:H13');

    // add width size to Columns
    // add height size to Rows
    headerRow.height = 30;

    // add height size to Columns
    // add width size to Columns
    colA.width = 30;
    colB.width = 30;
    colC.width = 20;
    colD.width = 15;
    colE.width = 40;
    colF.width = 40;
    colG.width = 40;
    colH.width = 30;

    // Add Style
    cellTitle.font =
      cellDistrict.font =
      cellProvince.font =
      cellStartDate.font =
      cellEndDate.font =
      cellPharm.font =
        {
          name: 'Arial',
          family: 2,
          size: 11,
          italic: false,
          bold: true,
        };

    // Add Image
    worksheet.addImage(imageId, {
      tl: { col: 0, row: 1 },
      ext: { width: 144, height: 98 },
    });

    // Cereate Table
    worksheet.addTable({
      name: reportName,
      ref: 'A14',
      headerRow: true,
      totalsRow: false,
      style: {
        showRowStripes: false,
      },

      columns: [
        { name: 'NID', totalsRowLabel: 'Totals:', filterButton: false },
        { name: 'Nome', totalsRowLabel: 'none:', filterButton: false },
        {
          name: 'Data do Último Levantamento',
          totalsRowFunction: 'none',
          filterButton: false,
        },
        {
          name: 'Data em que Faltou ao Levantamento',
          totalsRowFunction: 'none',
          filterButton: false,
        },
        {
          name: 'Data em que Identificou o Abandono ao TARV [>59 dias faltosos]',
          totalsRowFunction: 'none',
          filterButton: false,
        },

        {
          name: 'Farmácia de Referência',
          totalsRowFunction: 'none',
          filterButton: false,
        },
        {
          name: 'Chamada Efectuada',
          totalsRowFunction: 'none',
          filterButton: false,
        },
      ],
      rows: data,
    });

    // Format all data cells
    const lastRowNum =
      worksheet.lastRow.number !== undefined ? worksheet.lastRow.number : 0;
    const lastTableRowNum = lastRowNum;

    //Loop through all table's row
    for (let i = 14; i <= lastTableRowNum; i++) {
      const row = worksheet.getRow(i);

      //Now loop through every row's cell and finally set alignment
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
        if (i == 14) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '1fa37b' },
            bgColor: { argb: '1fa37b' },
          };
          cell.font = {
            name: 'Arial',
            color: { argb: 'FFFFFFFF' },
            family: 2,
            size: 11,
            italic: false,
            bold: true,
          };
        }
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileExtension = '.xlsx';

    const blob = new Blob([buffer], { type: fileType });

    params.value.loading.loading.hide();
    
    saveAs(blob, fileName + fileExtension);
  },
  createArrayOfArrayRow(rows: any) {
    const data = [];

    for (const row in rows) {
      const createRow = [];
      createRow.push(rows[row].patientid);
      createRow.push(rows[row].fullname);
      createRow.push(reportService.getFormatDDMMYYYY(rows[row].lastpickupdate));
      createRow.push(
        rows[row].dataabandono !== null
          ? reportService.getFormatDDMMYYYY(rows[row].dataabandono)
          : '-'
      );
      createRow.push(reportService.getFormatDDMMYYYY(rows[row].nextpickupdate));
      createRow.push(rows[row].clinicname);

      createRow.push(rows[row].contact);
      data.push(createRow);
    }

    return data;
  },
};

// autoTable(doc, {
//   margin: { top: 50 },
//   bodyStyles: {
//     halign: 'center',
//   },
//   theme: 'striped',
//   columns: [
//     { header: 'NID', dataKey: 'patientid' },
//     { header: 'Nome', dataKey: 'fullname' },
//     { header: 'Idade', dataKey: 'age' },
//     { header: 'Data da Ultima Prescrição', dataKey: 'prescriptiondate' },
//     { header: 'Regime Terapêutico', dataKey: 'regime' },
//     { header: 'Data Prox. Levant.', dataKey: 'nextpickupdate' },
//     { header: 'Data de Referência', dataKey: 'referaldate' },
//     { header: 'Farmácia de Referência', dataKey: 'clinicname' },
//   ],
//   body: rows,
// });
