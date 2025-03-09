// Al cargar el DOM se inicializa la app
document.addEventListener('DOMContentLoaded', function() {
  // Cargamos la lista de personas desde localStorage o la inicializamos
  let persons = JSON.parse(localStorage.getItem('persons')) || [];
  if (persons.length === 0) {
    for (let i = 1; i <= 20; i++) {
      persons.push({
        id: i,
        name: 'Publicador ' + i,
        absenceHistory: [] // Almacenará objetos { date: 'YYYY-MM-DD', meetingType: 'Jueves' o 'Fin de Semana' }
      });
    }
    localStorage.setItem('persons', JSON.stringify(persons));
  }

  // Función para renderizar la tabla de asistencia
  function renderTable() {
    const tbody = document.querySelector('#attendanceTable tbody');
    tbody.innerHTML = '';
    persons.forEach((person, index) => {
      const tr = document.createElement('tr');

      // Celda de nombre editable
      const tdName = document.createElement('td');
      const inputName = document.createElement('input');
      inputName.type = 'text';
      inputName.value = person.name;
      inputName.addEventListener('change', function() {
        person.name = inputName.value;
        localStorage.setItem('persons', JSON.stringify(persons));
      });
      tdName.appendChild(inputName);
      tr.appendChild(tdName);

      // Celda para asistencia del Jueves
      const tdJueves = document.createElement('td');
      const selectJueves = createAttendanceSelect();
      tdJueves.appendChild(selectJueves);
      tr.appendChild(tdJueves);

      // Celda para asistencia de Fin de Semana
      const tdWeekend = document.createElement('td');
      const selectWeekend = createAttendanceSelect();
      tdWeekend.appendChild(selectWeekend);
      tr.appendChild(tdWeekend);

      // Celda con el número de faltas (al hacer clic se muestra el detalle)
      const tdFaltas = document.createElement('td');
      tdFaltas.textContent = person.absenceHistory.length;
      tdFaltas.style.cursor = 'pointer';
      tdFaltas.title = 'Haz clic para ver el historial de faltas';
      tdFaltas.addEventListener('click', function() {
        if (person.absenceHistory.length === 0) {
          alert(`No hay historial de faltas para ${person.name}.`);
        } else {
          const detalles = person.absenceHistory
            .map(rec => `${rec.date} (${rec.meetingType})`)
            .join('\n');
          alert(`Historial de faltas de ${person.name}:\n${detalles}`);
        }
      });
      tr.appendChild(tdFaltas);

      tbody.appendChild(tr);
    });
  }

  // Función para crear el select de asistencia con las opciones requeridas
  function createAttendanceSelect() {
    const select = document.createElement('select');
    const options = ['', 'Presencial', 'Zoom', 'Ausente'];
    options.forEach(optionValue => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.textContent = optionValue === '' ? 'Seleccionar' : optionValue;
      select.appendChild(option);
    });
    return select;
  }

  renderTable();

  // Función para guardar la reunión y actualizar el historial de faltas
  document.getElementById('saveMeeting').addEventListener('click', function() {
    const weekdayDate = document.getElementById('weekday-date').value;
    const weekendDate = document.getElementById('weekend-date').value;

    if (!weekdayDate || !weekendDate) {
      alert('Por favor ingresa las fechas de ambas reuniones.');
      return;
    }

    // Recorremos cada fila de la tabla y registramos la asistencia
    const tbody = document.querySelector('#attendanceTable tbody');
    Array.from(tbody.children).forEach((tr, index) => {
      const selects = tr.querySelectorAll('select');
      // Para la reunión de Jueves
      if (selects[0].value === 'Ausente') {
        persons[index].absenceHistory.push({
          date: weekdayDate,
          meetingType: 'Jueves'
        });
      }
      // Para la reunión de Fin de Semana
      if (selects[1].value === 'Ausente') {
        persons[index].absenceHistory.push({
          date: weekendDate,
          meetingType: 'Fin de Semana'
        });
      }
      // Se reinician los selects para la siguiente reunión
      selects[0].value = '';
      selects[1].value = '';
    });

    localStorage.setItem('persons', JSON.stringify(persons));
    renderTable();
    alert('Reunión guardada y registro actualizado.');
  });

  // Función para exportar la información a CSV (que puede abrirse en Excel)
  document.getElementById('exportExcel').addEventListener('click', function() {
    let csvContent = "data:text/csv;charset=utf-8,ID,Nombre,Total Faltas,Historial\n";
    persons.forEach(person => {
      const historial = person.absenceHistory
        .map(rec => `${rec.date} (${rec.meetingType})`)
        .join(" | ");
      csvContent += `${person.id},${person.name},${person.absenceHistory.length},"${historial}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "asistencia.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});