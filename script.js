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

let attendanceRecords = {};
let historyRecords = [];

// Inicializa la aplicación: genera tarjetas para cada persona.
function initializeApp() {
  const container = document.getElementById('attendanceList');
  
  people.forEach(person => {
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
    
    // Agrega evento a cada botón de estado
    card.querySelectorAll('.status-btn').forEach(button => {
      button.addEventListener('click', () => {
        const status = button.dataset.status;
        const meetingDay = document.getElementById('meetingDay').value;
        const date = new Date().toLocaleString();
        
        // Si ya existe un registro para esta persona en el mismo día, no permitir nueva entrada.
        if(attendanceRecords[person.id] && attendanceRecords[person.id].meetingDay === meetingDay) {
          alert('Ya se ha ingresado un dato para esta persona. Para corregir, presiona el botón "Corregir".');
          return;
        }
        
        // Actualiza estilos: marca el botón seleccionado y reduce opacidad de los demás.
        card.querySelectorAll('.status-btn').forEach(btn => {
          btn.classList.remove('selected');
          btn.style.opacity = '0.7';
          btn.disabled = true;  // Bloquea para que no se registre otro dato.
        });
        button.classList.add('selected');
        button.style.opacity = '1';
        
        // Crear registro
        const record = {
          id: person.id,
          name: person.name,
          status: status,
          date: date,
          meetingDay: meetingDay
        };
        
        attendanceRecords[person.id] = record;
        historyRecords.push(record);
        updateHistory(record);
        
        // Agregar botón de corrección si no existe
        if(!card.querySelector('.correct-btn')) {
          const correctBtn = document.createElement('button');
          correctBtn.textContent = 'Corregir';
          correctBtn.className = 'correct-btn';
          correctBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Remover el registro para esta persona
            delete attendanceRecords[person.id];
            // Rehabilitar botones de estado
            card.querySelectorAll('.status-btn').forEach(btn => {
              btn.disabled = false;
              btn.classList.remove('selected');
              btn.style.opacity = '0.7';
            });
            // Remover botón de corrección
            correctBtn.remove();
            // Remover registro del historial y actualizar visualización
            historyRecords = historyRecords.filter(r => !(r.id === person.id && r.meetingDay === meetingDay));
            updateHistoryDisplay();
          });
          card.appendChild(correctBtn);
        }
      });
    });
    
    container.appendChild(card);
  });
}

// Agrega un registro al historial visual
function updateHistory(record) {
  const historyList = document.getElementById('historyList');
  const historyItem = document.createElement('div');
  let borderClass = '';
  if(record.status === 'presencial') {
    borderClass = 'presencial-border';
  } else if(record.status === 'zoom') {
    borderClass = 'zoom-border';
  } else if(record.status === 'ausente') {
    borderClass = 'ausente-border';
  }
  historyItem.className = `history-item ${borderClass}`;
  historyItem.innerHTML = `
    <div>
      <div class="history-date">${record.date}</div>
      <div class="history-name">${record.name}</div>
    </div>
    <div class="status-tag ${record.status}">${record.status.toUpperCase()}</div>
  `;
  historyList.prepend(historyItem);
}

// Re-renderiza todo el historial (por ejemplo, al corregir un registro)
function updateHistoryDisplay() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  historyRecords.forEach(record => {
    let borderClass = '';
    if(record.status === 'presencial') {
      borderClass = 'presencial-border';
    } else if(record.status === 'zoom') {
      borderClass = 'zoom-border';
    } else if(record.status === 'ausente') {
      borderClass = 'ausente-border';
    }
    const historyItem = document.createElement('div');
    historyItem.className = `history-item ${borderClass}`;
    historyItem.innerHTML = `
      <div>
        <div class="history-date">${record.date}</div>
        <div class="history-name">${record.name}</div>
      </div>
      <div class="status-tag ${record.status}">${record.status.toUpperCase()}</div>
    `;
    historyList.prepend(historyItem);
  });
}

// Genera el reporte PDF usando jsPDF y jsPDF-AutoTable
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

// Devuelve un color RGB según el estado
function getColor(status) {
  const colors = {
    presencial: [39, 174, 96],
    zoom: [41, 128, 185],
    ausente: [192, 57, 43]
  };
  return colors[status];
}

// Inicia la aplicación al cargar el DOM
window.addEventListener('DOMContentLoaded', initializeApp);