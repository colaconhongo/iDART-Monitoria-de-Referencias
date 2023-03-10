import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import reportService from '../reportService';
import { MOHIMAGELOG } from 'src/assets/imageBytes';
import useUtils from 'src/use/useUtils';
import { alert } from 'src/components/Shared/Directives/Plugins/Dialog/dialog';

const logoTitle =
  'REPÚBLICA DE MOÇAMBIQUE \n MINISTÉRIO DA SAÚDE \n SERVIÇO NACIONAL DE SAÚDE';
const title = 'Lista de Pacientes Faltosos ao Levantamento';
const reportName = 'PacientesFaltososAoLevantamento';
const fileName = reportName.concat(
  '_' + useUtils.getDateFormatDDMMYYYY(new Date())
);

export default {
  async downloadPDF(
    facility: string,
    province: string,
    startDate: string,
    endDate: string,
    params: object,
    loadingPDF: object
  ) {
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 'smart', // or "smart", default is 16
    });
    loadingPDF.value = true;
    const image = new Image();
    // image.src = '/src/assets/MoHLogo.png';
    image.src = 'data:image/png;base64,' + MOHIMAGELOG;
    const width = doc.internal.pageSize.getWidth();
    /*
      Fill Table
    */
    const cols = [
      'Ordem',
      'NID',
      'Nome',
      'Data do Último Levanatmento',
      'Data em que Faltou ao Levantamento',
      'Data em que Identificou o Abandono ao TARV [>59 dias faltosos]',
      'Farmácia de Referência',
      'Unidade Sanitária',
      'Chamada Efectuada',
    ];
    const rows = await reportService.getPatientsWithMissDispenses(params);
    const data = this.createArrayOfArrayRow(rows);

    autoTable(doc, {
      margin: { top: 60 },
      // columnStyles: {
      //   0: { cellWidth: 50 },
      //   1: { cellWidth: 50 },
      // },
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
        params.value.district !== null && params.value.district !== undefined
          ? doc.text(
              'Distrito: ' + params.value.district.name,
              width / 3 - 15,
              57
            )
          : '';
        params.value.clinic !== null && params.value.clinic !== undefined
          ? doc.text(
              'Farmácia: ' + params.value.clinic.clinicname,
              width / 2 + 30,
              57
            )
          : '';
        doc.text('Data Início: ' + startDate, width / 2 + 98, 49);
        doc.text('Data Fim: ' + endDate, width / 2 + 98, 57);
        // doc.line(0, 35, 400, 50);
      },
      theme: 'grid',
      head: [cols],
      body: data,
    });
    loadingPDF.value = false;

    if (data.length > 0) {
      return doc.save(fileName.concat('.pdf'));
    } else {
      alert(
        'O Relatório está vazio!',
        'O relatório que pretende gerar não contém dados \n Por favor, verifique os parametros de pesquisa.',
        null,
        null,
        null
      );
    }
  },

  async downloadExcel(
    facility: string,
    province: string,
    startDate: string,
    endDate: string,
    params: object,
    loadingXLS: object
  ) {
    facility =
      params.value.clinic !== null && params.value.clinic !== undefined
        ? params.value.clinic.clinicname
        : '';
    loadingXLS.value = true;
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
    const cellStartDate = worksheet.getCell('H11');
    const cellEndDate = worksheet.getCell('H12');
    const cellPharmParamValue = worksheet.getCell('B11');
    const cellDistrictParamValue = worksheet.getCell('B12');
    const cellProvinceParamValue = worksheet.getCell('E12');
    const cellStartDateParamValue = worksheet.getCell('I11');
    const cellEndDateParamValue = worksheet.getCell('I12');

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
    const colI = worksheet.getColumn('I');

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
    cellDistrictParamValue.value =
      params.value.district !== null && params.value.district !== undefined
        ? params.value.district.name
        : '';
    cellStartDateParamValue.value = startDate;
    cellEndDateParamValue.value = endDate;
    cellPharm.value = 'Farmácia';
    cellDistrict.value = 'Distrito';
    cellProvince.value = 'Província';
    cellStartDate.value = 'Data Início';
    cellEndDate.value = 'Data Fim';

    // merge a range of cells
    worksheet.mergeCells('A1:A7');
    worksheet.mergeCells('A9:I10');
    worksheet.mergeCells('B11:G11');
    worksheet.mergeCells('B12:C12');
    worksheet.mergeCells('E12:G12');
    worksheet.mergeCells('A13:I13');

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
    colI.width = 30;

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
        { name: 'Ordem', totalsRowLabel: 'Totals:', filterButton: false },
        { name: 'NID', totalsRowLabel: 'none:', filterButton: false },
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
          name: 'Unidade Sanitária',
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
    loadingXLS.value = false;
    if (data.length > 0) {
      saveAs(blob, fileName + fileExtension);
    } else {
      alert(
        'O Relatório está vazio!',
        'O relatório que pretende gerar não contém dados \n Por favor, verifique os parametros de pesquisa.',
        null,
        null,
        null
      );
      return;
    }
  },
  createArrayOfArrayRow(rows: any) {
    const data = [];
    let Ordem = 1;

    for (const row in rows) {
      const createRow = [];
      createRow.push(Ordem);
      createRow.push(rows[row].patientid);
      createRow.push(rows[row].fullname);
      createRow.push(
        useUtils.getDateFormatDDMMYYYYFromYYYYMMDD(rows[row].lastpickupdate)
      );
      createRow.push(
        rows[row].nextpickupdate !== null
          ? useUtils.getDateFormatDDMMYYYYFromYYYYMMDD(rows[row].nextpickupdate)
          : '-'
      );
      createRow.push(
        rows[row].dataabandono !== null
          ? useUtils.getDateFormatDDMMYYYYFromYYYYMMDD(rows[row].dataabandono)
          : '-'
      );
      createRow.push(rows[row].clinicname);
      createRow.push(rows[row].mainclinicname);
      createRow.push(rows[row].contact);
      data.push(createRow);
      Ordem += 1;
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
