import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import reportService from '../reportService';

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
      'Idade',
      'Data da Referência',
      'Data do Último Levant.',
      'Farmácia de Referência',
      'Data de Retorno a US',
      'Notas',
    ];
    const rows = await reportService.getReturnedReferedPatient(params);
    const data = [];

    for (const row in rows) {
      const createRow = [];
      createRow.push(rows[row].patientid);
      createRow.push(rows[row].fullname);
      createRow.push(rows[row].age);
      createRow.push(
        reportService.getFormatDDMMYYYY(rows[row].referaldate)
      );
      createRow.push(reportService.getFormatDDMMYYYY(rows[row].lastpickupdate));
      createRow.push(rows[row].clinicname);
      createRow.push(reportService.getFormatDDMMYYYY(rows[row].returndate));
      createRow.push(rows[row].stopreason);

      data.push(createRow);
    }
    autoTable(doc, {
      margin: { top: 60 },
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
        doc.text('Relatório de Pacientes Referidos que',
          width / 2,
          35,
          {
            align: 'center',
          }
        );
        doc.text('Regressaram à Unidade Sanitária',
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
    return doc.save('PacientesReferidosDeVolta.pdf');
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
