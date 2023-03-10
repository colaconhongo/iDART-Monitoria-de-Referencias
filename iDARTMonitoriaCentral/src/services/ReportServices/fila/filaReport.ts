import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import reportService from '../reportService';
import useUtils from 'src/use/useUtils';
import { MOHIMAGELOG } from 'src/assets/imageBytes';
import { alert } from 'src/components/Shared/Directives/Plugins/Dialog/dialog';

const title = 'Ficha Individual de Levantamento de ARVs ( FILA)';
const reportName = 'fila';
const fileName = reportName.concat(
  '_' + useUtils.getDateFormatDDMMYYYY(new Date())
);

export default {
  async downloadPDF(patient: object, loadingPDF: object) {
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
      'Data de Levantamento de ARVs',
      'Medicamentos ARVs',
      'Quantidade Aviada',
      'Dosagem',
      'Data Prox. Levant.',
    ];

    const rows = await reportService.getPrescriptionsByPatientId(
      patient.patientid
    );

    const data = [];

    for (const row in rows) {
      const createRow = [];
      createRow.push(
        useUtils.getDateFormatDDMMYYYYFromYYYYMMDD(rows[row].pickupdate)
      );
      createRow.push(rows[row].drugname);
      createRow.push(rows[row].qtyinhand.replace(/[{()}]/g, ''));
      createRow.push(rows[row].timesperday);
      createRow.push(rows[row].dateexpectedstring);

      data.push(createRow);
    }

    const desiredDefinition = [
      [
        {
          content: 'NID:    ' + patient.patientid,
          rowSpan: 4,
          halign: 'center',
          valign: 'middle',
          fontStyle: 'bold',
          fontSize: '14',
        },
        {
          content: 'Nome:',
          halign: 'left',
          valign: 'middle',
          fontStyle: 'bold',
          fontSize: '14',
        },
        { content: patient.firstnames },
        { content: 'Apelido:' },
        { content: patient.lastname },
      ],

      [
        { content: 'Idade:' },
        { content: Math.abs(useUtils.ageCalculator(patient.dateofbirth)) },
        { content: 'Sexo:' },
        { content: patient.sex == 'F' ? 'Femenino' : 'Masculino' },
      ],
      [
        { content: 'Contacto:' },
        { content: patient.cellphone },
        { content: 'Endereço:' },
        { content: patient.address1 },
      ],
    ];
    autoTable(
      doc,

      {
        margin: { top: 60 },
        bodyStyles: {
          halign: 'center',
          valign: 'middle',
        },
        headStyles: {
          halign: 'center',
          valign: 'middle',
        },

        theme: 'grid',
        body: desiredDefinition,
      }
    );

    autoTable(doc, {
      margin: { top: 60 },
      bodyStyles: {
        halign: 'center',
        valign: 'middle',
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
        doc.text(title, width / 2, 40, {
          align: 'center',
        });
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

  createArrayOfArrayRow(rows: any) {
    const data = [];

    for (const row in rows) {
      const createRow = [];
      createRow.push(rows[row].patientid);
      createRow.push(rows[row].fullname);
      createRow.push(rows[row].age);
      createRow.push(
        useUtils.getDateFormatDDMMYYYYFromYYYYMMDD(rows[row].prescriptiondate)
      );
      createRow.push(rows[row].regime);
      createRow.push(
        useUtils.getDateFormatDDMMYYYYFromYYYYMMDD(rows[row].nextpickupdate)
      );
      createRow.push(
        useUtils.getDateFormatDDMMYYYYFromYYYYMMDD(rows[row].referaldate)
      );
      createRow.push(rows[row].clinicname);

      data.push(createRow);
    }

    return data;
  },
};
