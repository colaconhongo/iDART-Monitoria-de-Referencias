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
      createRow.push(rows[row].dataabandono !== null ? reportService.getFormatDDMMYYYY(rows[row].dataabandono) : '-');
      createRow.push(rows[row].clinicname);
      createRow.push(rows[row].contact);

      data.push(createRow);
    }
    autoTable(doc, {
      margin: { top: 60 },
      columnStyles: {
        0: {cellWidth: 50},
        1: {cellWidth: 50},
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
        doc.text('Relatório de Pacientes Referidos e Faltosos ao',
          width / 2,
          35,
          {
            align: 'center',
          }
        );
        doc.text('Levantamento de ARVs na Farmácia de Referência',
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
    return doc.save('FaltososAoLevantamento.pdf');
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
