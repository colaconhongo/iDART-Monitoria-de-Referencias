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
      'Contacto',
      'Linha Terapeutica',
      'Regime Terapeutico',
      'Data Levant.',
      'Data Prox. Levant.',
      'Farmácia',
    ];
    const rows = await reportService.getActivePatients(params);
    const data = [];

    for (const row in rows) {
      const createRow = [];
      createRow.push(rows[row].patientid);
      createRow.push(rows[row].fullname);
      createRow.push(rows[row].age);
      createRow.push(rows[row].contact);
      createRow.push(rows[row].linhanome);
      createRow.push(rows[row].regime);
      createRow.push(reportService.getFormatDDMMYYYY(rows[row].lastpickupdate));
      createRow.push(reportService.getFormatDDMMYYYY(rows[row].nextpickupdate));
      createRow.push(rows[row].clinicname);

      data.push(createRow);
    }
    autoTable(doc, {
      margin: { top: 60 },
      columnStyles: {
        0: {cellWidth: 48},
        1: {cellWidth: 55},
        2: {cellWidth: 20},
        3: {cellWidth: 26},
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
          'Lista de Pacientes Activos na Farmácia',
          width / 2,
          40,
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
    return doc.save('PacientesActivos.pdf');
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
