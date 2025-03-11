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

let attendanceRecords = {}; // Guarda el registro de asistencia actual, clave: person.id
let historyRecords = [];    // Guarda todos los registros introducidos en la sesión

// Muestra la fecha actual en el encabezado con formato completo
function displayCurrentDate() {
  const currentDateDiv = document.getElementById('currentDate');
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  currentDateDiv.textContent = `Fecha de hoy: ${formattedDate}`;
}

function initializeApp() {
  displayCurrentDate();
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
    
    // Evento para cada botón de estado
    card.querySelectorAll('.status-btn').forEach(button => {
      button.addEventListener('click', () => {
        const status = button.dataset.status;
        const meetingDay = document.getElementById('meetingDay').value;
        const meetingDate = document.getElementById('meetingDate').value;
        if (!meetingDate) {
          alert("Por favor, indique la fecha de la reunión.");
          return;
        }
        const now = new Date();
        const date = now.toLocaleString();
        
        // Crea el nuevo registro, incluyendo la fecha de la reunión
        const newRecord = {
          id: person.id,
          name: person.name,
          status: status,
          date: date,
          meetingDay: meetingDay,
          meetingDate: meetingDate
        };
        
        // Si ya existe un registro para esta persona con la misma fecha de reunión, se sobreescribe.
        if(attendanceRecords[person.id] && attendanceRecords[person.id].meetingDate === meetingDate) {
          attendanceRecords[person.id] = newRecord;
          historyRecords = historyRecords.filter(r => !(r.id === person.id && r.meetingDate === meetingDate));
          historyRecords.push(newRecord);
          // Actualiza el historial visual
          updateHistoryDisplay();
          // También actualiza el historial anual de la persona (se sobreescribe el registro con la misma fecha)
          const personData = people.find(p => p.id === person.id);
          if(personData) {
            personData.absenceHistory = personData.absenceHistory.filter(r => r.meetingDate !== meetingDate);
            personData.absenceHistory.push(newRecord);
          }
          return;
        }
        
        // Si no existe, se registra normalmente: se deshabilitan los botones y se resalta el seleccionado
        card.querySelectorAll('.status-btn').forEach(btn => {
          btn.classList.remove('selected');
          btn.disabled = true;
        });
        button.classList.add('selected');
        
        attendanceRecords[person.id] = newRecord;
        historyRecords.push(newRecord);
        updateHistory(newRecord);
        
        // Agrega el registro al historial anual del alumno (se elimina cualquier registro previo para esa fecha)
        const personData = people.find(p => p.id === person.id);
        if(personData) {
          personData.absenceHistory = personData.absenceHistory.filter(r => r.meetingDate !== meetingDate);
          personData.absenceHistory.push(newRecord);
        }
        
        // Agrega el botón de corrección si aún no existe en la tarjeta
        if(!card.querySelector('.correct-btn')) {
          const correctBtn = document.createElement('button');
          correctBtn.textContent = 'Corregir';
          correctBtn.className = 'correct-btn';
          correctBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Remueve el registro para esta persona
            delete attendanceRecords[person.id];
            card.querySelectorAll('.status-btn').forEach(btn => {
              btn.disabled = false;
              btn.classList.remove('selected');
            });
            historyRecords = historyRecords.filter(r => !(r.id === person.id && r.meetingDate === meetingDate));
            updateHistoryDisplay();
            const personData = people.find(p => p.id === person.id);
            if(personData) {
              personData.absenceHistory = personData.absenceHistory.filter(r => r.meetingDate !== meetingDate);
            }
            correctBtn.remove();
          });
          card.appendChild(correctBtn);
        }
      });
    });
    
    container.appendChild(card);
  });
}

// Agrega un registro al historial visual (se agrega siempre al inicio)
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

// Re-renderiza todo el historial visual (por ejemplo, después de una corrección o sobreescritura)
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

// Función auxiliar para calcular el número de reuniones consecutivas
// basada en el historial anual del alumno para el tipo de reunión seleccionado.
function computeConsecutiveCounts(personData, meetingDay) {
  // Filtra los registros de la persona por el tipo de reunión
  const records = personData.absenceHistory.filter(r => r.meetingDay === meetingDay);
  let consecutiveAttendance = 0;
  let consecutiveAbsence = 0;
  // Recorre desde el registro más reciente hacia atrás
  for (let i = records.length - 1; i >= 0; i--) {
    const status = records[i].status;
    if (status === 'ausente') {
      if (consecutiveAttendance > 0) break;
      consecutiveAbsence++;
    } else { // "presencial" o "zoom"
      if (consecutiveAbsence > 0) break;
      consecutiveAttendance++;
    }
  }
  return { consecutiveAttendance, consecutiveAbsence };
}

// Genera el reporte PDF usando jsPDF y jsPDF-AutoTable
function generateReport() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const meetingDay = document.getElementById('meetingDay').value;
  const meetingDate = document.getElementById('meetingDate').value;
  const records = Object.values(attendanceRecords).filter(r => r.meetingDay === meetingDay && r.meetingDate === meetingDate);
  
  if (records.length === 0) {
    alert('⚠️ No hay registros para este día');
    return;
  }
  
  // Encabezado del PDF con datos ampliados
  doc.setFontSize(18);
  doc.setTextColor(40, 62, 80);
  doc.text("Reporte de Asistencia", 15, 20);
  doc.setFontSize(14);
  doc.text(`Reunión: ${meetingDay === 'entresemana' ? 'Entresemana' : 'Fin de Semana'}`, 15, 30);
  doc.text(`Fecha de la reunión: ${meetingDate}`, 15, 40);
  
  // Define las cabeceras de la tabla, incluyendo las nuevas columnas
  const headers = [[
    "Nombre", 
    "Estado", 
    "Fecha Introducción", 
    "Asistencias Consecutivas", 
    "Faltas Consecutivas"
  ]];
  
  // Prepara los datos de la tabla
  const data = records.map(r => {
    const personData = people.find(p => p.id === r.id);
    let attendanceStreak = 0;
    let absenceStreak = 0;
    if (personData) {
      const counts = computeConsecutiveCounts(personData, meetingDay);
      attendanceStreak = counts.consecutiveAttendance;
      absenceStreak = counts.consecutiveAbsence;
    }
    return [
      r.name,
      { content: r.status.toUpperCase(), styles: { fillColor: getColor(r.status) } },
      r.date,
      attendanceStreak,
      absenceStreak
    ];
  });
  
  // Dibuja la tabla (se inicia a partir de y=50 para dejar espacio al encabezado)
  doc.autoTable({
    startY: 50,
    head: headers,
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30 },
      2: { cellWidth: 50 },
      3: { cellWidth: 40 },
      4: { cellWidth: 40 }
    }
  });
  
  doc.save(`Asistencia_${meetingDay}_${meetingDate}.pdf`);
  
  // Una vez descargado el reporte, reinicia la aplicación
  resetApp();
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

// Reinicia la aplicación: limpia registros, historial visual y restablece las tarjetas
function resetApp() {
  // Limpia los registros globales
  attendanceRecords = {};
  historyRecords = [];
  
  // Limpia el contenido de la lista de asistencia y del historial visual
  document.getElementById('attendanceList').innerHTML = "";
  document.getElementById('historyList').innerHTML = "";
  
  // Reinicia la generación de tarjetas para cada persona
  initializeApp();
  
  // (Opcional) Se puede limpiar el input de fecha si se desea:
  // document.getElementById('meetingDate').value = "";
}

// Inicia la aplicación al cargar el DOM
window.addEventListener('DOMContentLoaded', initializeApp);