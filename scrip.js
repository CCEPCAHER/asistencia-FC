// Arreglo de 20 personas con sus propiedades básicas
const people = [
  { id: 1,  name: "Arellano, Carmen", absenceHistory: [] },
  { id: 2,  name: "Bustos Navarro Felipe", absenceHistory: [] },
  { id: 3,  name: "Bustos Lisandra", absenceHistory: [] },
  { id: 4,  name: "Carranza, Franklin", absenceHistory: [] },
  { id: 5,  name: "Carranza, Vanessa Jesse de", absenceHistory: [] },
  { id: 6,  name: "Da Silva, Valdemir", absenceHistory: [] },
  { id: 7,  name: "De Silva, Pereira Joelma de", absenceHistory: [] },
  { id: 8,  name: "Dos Santos, Marcos", absenceHistory: [] },
  { id: 9,  name: "Góngora, Érika", absenceHistory: [] },
  { id: 10, name: "Góngora, Isabel Cortés de", absenceHistory: [] },
  { id: 11, name: "Pereira Dos Santos, Joselma", absenceHistory: [] },
  { id: 12, name: "Pulido, Manuel", absenceHistory: [] },
  { id: 13, name: "Pulido Doncel, Brigita de", absenceHistory: [] },
  { id: 14, name: "Rodríguez, Javier", absenceHistory: [] },
  { id: 15, name: "Ruíz, Ronny David", absenceHistory: [] },
  { id: 16, name: "Sánchez Maria Elena", absenceHistory: [] },
  { id: 17, name: "Silvosa, Manuel", absenceHistory: [] },
  { id: 18, name: "Valdivieso, Cristián", absenceHistory: [] },
  { id: 19, name: "Valderrama, Jhon", absenceHistory: [] },
  { id: 20, name: "Velázquez, Mª Ethelinda", absenceHistory: [] }
];

// Objetos para guardar registros de asistencia y el historial completo
let attendanceRecords = {};
let history = [];

/* 
  Función initializeApp: 
  - Asigna el listener para actualizar el encabezado según el día de reunión.
  - Genera, para cada persona, una "tarjeta" con su nombre y tres botones de estado.
*/
function initializeApp() {
  const meetingDaySelect = document.getElementById('meetingDay');
  meetingDaySelect.addEventListener('change', updateMeetingHeader);
  updateMeetingHeader();

  const container = document.getElementById('attendanceList');
  container.innerHTML = ''; // Limpiar el contenedor

  people.forEach(person => {
    // Crear tarjeta de persona
    const card = document.createElement('div');
    card.className = 'person-card';
    card.innerHTML = `
      <div class="person-name">${person.name}</div>
      <div class="status-buttons">
        <button class="status-btn presencial" data-status="presencial">Presencial</button>
        <button class="status-btn zoom" data-status="zoom">Zoom</button>
        <button class="status-btn ausente" data-status="ausente">Ausente</button>
      </div>
    `;
    
    // Asignar listener a cada botón de estado
    card.querySelectorAll('.status-btn').forEach(button => {
      button.addEventListener('click', () => {
        const status = button.dataset.status;
        const meetingDay = document.getElementById('meetingDay').value;
        const date = new Date();
        const recordKey = `${person.id}-${meetingDay}`;
        
        if (attendanceRecords[recordKey]) {
          alert('⚠️ Esta persona ya tiene un registro para esta reunión');
          return;
        }
        
        // Reiniciar el estado de todos los botones en esta tarjeta
        card.querySelectorAll('.status-btn').forEach(btn => {
          btn.classList.remove('selected');
          btn.disabled = false;
        });
        
        button.classList.add('selected');
        button.disabled = true;
        
        // Crear el registro de asistencia
        const record = {
          id: person.id,
          name: person.name,
          status: status,
          date: date.toLocaleString(),
          meetingDay: meetingDay
        };
        
        attendanceRecords[recordKey] = record;
        history.push(record);
        updateHistory(record);
        
        // Agregar botón para corregir la selección
        const correctBtn = document.createElement('button');
        correctBtn.className = 'correct-btn';
        correctBtn.innerHTML = '✏️ Corregir';
        correctBtn.onclick = (e) => {
          e.stopPropagation();
          // Eliminar el registro
          delete attendanceRecords[recordKey];
          // Habilitar nuevamente los botones y quitar la selección
          card.querySelectorAll('.status-btn').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('selected');
          });
          // Eliminar el botón de corrección
          correctBtn.remove();
          // Eliminar del historial
          const index = history.findIndex(r => r.id === record.id && r.meetingDay === record.meetingDay);
          if (index > -1) history.splice(index, 1);
          updateHistoryDisplay();
        };
        // Insertar el botón de corrección justo después del nombre
        card.querySelector('.person-name').after(correctBtn);
      });
    });
    
    container.appendChild(card);
  });
}

/* 
  updateMeetingHeader: Actualiza el encabezado mostrando el día de reunión 
  y la fecha actual en formato largo (en español).
*/
function updateMeetingHeader() {
  const meetingDay = document.getElementById('meetingDay').value;
  const dateOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const currentDate = new Date().toLocaleDateString('es-ES', dateOptions);
  document.getElementById('currentDate').textContent = 
    `${meetingDay.charAt(0).toUpperCase() + meetingDay.slice(1)} - ${currentDate}`;
}

/* 
  updateHistory: Añade un registro al historial (visualizado en "historyList").
*/
function updateHistory(record) {
  const historyList = document.getElementById('historyList');
  const historyItem = document.createElement('div');
  historyItem.className = `history-item ${record.status}-border`;
  historyItem.innerHTML = `
    <div>
      <div class="history-date">${record.date}</div>
      <div>${record.name}</div>
    </div>
    <div class="status-tag ${record.status}">${record.status.toUpperCase()}</div>
  `;
  historyList.prepend(historyItem);
}

/* 
  updateHistoryDisplay: Vuelve a renderizar todo el historial (usado al corregir un registro).
*/
function updateHistoryDisplay() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  history.forEach(record => {
    const historyItem = document.createElement('div');
    historyItem.className = `history-item ${record.status}-border`;
    historyItem.innerHTML = `
      <div>
        <div class="history-date">${record.date}</div>
        <div>${record.name}</div>
      </div>
      <div class="history-status ${record.status}">${record.status.toUpperCase()}</div>
    `;
    historyList.prepend(historyItem);
  });
}

/* 
  generateReport: Genera un PDF con los registros de asistencia del día seleccionado.
  Requiere las librerías jsPDF y jsPDF-AutoTable (asegúrate de incluirlas en el HTML).
*/
function generateReport() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const meetingDay = document.getElementById('meetingDay').value;
  const records = Object.values(attendanceRecords).filter(r => r.meetingDay === meetingDay);
  
  if (records.length === 0) {
    alert('⚠️ No hay registros para este día');
    return;
  }
  
  doc.setFontSize(18);
  doc.setTextColor(40, 62, 80);
  doc.text(`Reporte de Asistencia - ${meetingDay.toUpperCase()}`, 15, 20);
  
  const headers = [["Nombre", "Estado", "Fecha"]];
  const data = records.map(r => [
    r.name,
    { content: r.status.toUpperCase(), styles: { fillColor: getColor(r.status) } },
    r.date
  ]);
  
  doc.autoTable({
    startY: 30,
    head: headers,
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30 },
      2: { cellWidth: 60 }
    }
  });
  
  doc.save(`Asistencia_${meetingDay}_${new Date().toISOString().split('T')[0]}.pdf`);
}

/* 
  getColor: Devuelve un arreglo RGB según el estado.
*/
function getColor(status) {
  const colors = {
    presencial: [39, 174, 96],
    zoom: [41, 128, 185],
    ausente: [192, 57, 43]
  };
  return colors[status];
}

// Inicializa la app cuando el DOM esté completamente cargado
window.addEventListener('DOMContentLoaded', initializeApp);