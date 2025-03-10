document.addEventListener("DOMContentLoaded", () => {
  // Lista de personas con información y rol de capitán
  const persons = [
    { name: "Lola Aradilla", isCaptain: false },
    { name: "Laura Andres", isCaptain: false },
    { name: "Antonia Carpintero", isCaptain: false },
    { name: "Sara Baño", isCaptain: false },
    { name: "Salvador Cadenas", isCaptain: true },
    { name: "Montse (hija) Cadenas", isCaptain: false },
    { name: "Franklin Carranza", isCaptain: true },
    { name: "Vanessa de Carranza", isCaptain: false },
    { name: "Sandra Carvajal", isCaptain: false },
    { name: "Rosa Corpas", isCaptain: false },
    { name: "Alejandro Correa", isCaptain: false },
    { name: "Isabel Cortés", isCaptain: false },
    { name: "Erika Góngora", isCaptain: false },
    { name: "Rosario González", isCaptain: false },
    { name: "Alejandro Hernández", isCaptain: true },
    { name: "Gloria Hernández", isCaptain: false },
    { name: "Javier Hernández", isCaptain: true },
    { name: "Montse de Hernández", isCaptain: false },
    { name: "Débora de Hosu", isCaptain: false },
    { name: "Samuel Hosu", isCaptain: true },
    { name: "Eliana Julián", isCaptain: false },
    { name: "Remedios Ligero", isCaptain: false },
    { name: "Olga Lópes 1", isCaptain: false },
    { name: "Iris López", isCaptain: false },
    { name: "Abigaíl López", isCaptain: false },
    { name: "Francisco López", isCaptain: true },
    { name: "Mª Carmen Lucía", isCaptain: false },
    { name: "Marta Martinez", isCaptain: false },
    { name: "Cristina de Mínguez", isCaptain: false },
    { name: "Francisco Mínguez", isCaptain: false },
    { name: "Segundo Miranda", isCaptain: true },
    { name: "María Montaño", isCaptain: false },
    { name: "Encarna de Moreno", isCaptain: false },
    { name: "José Moreno", isCaptain: true },
    { name: "Estéfany Muñoz", isCaptain: false },
    { name: "Jakeline Muñoz", isCaptain: false },
    { name: "Jimmy Muñoz", isCaptain: true },
    { name: "Samuel Ordoñez", isCaptain: true },
    { name: "Zulema de Ordoñez", isCaptain: false },
    { name: "Beatriz de Palomar", isCaptain: false },
    { name: "Claudio Palomar", isCaptain: true },
    { name: "Luis Fernando Paz", isCaptain: true },
    { name: "Joselma Pereira", isCaptain: false },
    { name: "Remedios Pérez", isCaptain: false },
    { name: "Santiago Quimbayo", isCaptain: true },
    { name: "Sara de Quimbayo", isCaptain: false },
    { name: "Sebastián Rodríguez", isCaptain: true },
    { name: "Javier Rodriguez", isCaptain: true },
    { name: "Teresa de Rodríguez", isCaptain: false },
    { name: "Aitana Ruíz", isCaptain: false },
    { name: "Eliú Ruíz", isCaptain: true },
    { name: "Juan Tomás Ruíz", isCaptain: false },
    { name: "Mireia de Ruíz", isCaptain: false },
    { name: "Rosa de Ruíz", isCaptain: false },
    { name: "Juan Sabio", isCaptain: true },
    { name: "Laura de Sabio", isCaptain: false },
    { name: "Francisco Sánchez", isCaptain: true },
    { name: "Ericka Sánchez", isCaptain: false },
    { name: "Julissa de Soria", isCaptain: false },
    { name: "Pablo Soria", isCaptain: false },
    { name: "Juan Luis Torres", isCaptain: true },
    { name: "Mercedes de Torres", isCaptain: false },
    { name: "Cristihan Valdivieso", isCaptain: true },
    { name: "Encarna de Velarde", isCaptain: false },
    { name: "Andres Velarde", isCaptain: false },
    { name: "Ethelinda Velázquez", isCaptain: false },
    { name: "Manoli de Vich", isCaptain: false }
  ];
  
  let fixedAssignments = {};
  let availability = {};
  let attendanceRecords = {};
  let historyRecords = [];
  
  // Función para obtener clave de disponibilidad (semana-turno)
  const getAvailabilityKey = () => {
    const week = document.getElementById("availWeekSelect").value;
    const turno = document.getElementById("availTurnSelect").value;
    return `${week}-${turno}`;
  };
  
  // Rellena el dropdown de personas según el rol seleccionado
  const populatePersonSelect = () => {
    const role = document.getElementById("roleSelect").value;
    const personSelect = document.getElementById("personSelect");
    personSelect.innerHTML = "";
    
    const filtered = role === "capitan"
      ? persons.filter(p => p.isCaptain)
      : persons;
    
    filtered.forEach(p => {
      const option = document.createElement("option");
      option.value = p.name;
      option.textContent = p.name;
      personSelect.appendChild(option);
    });
  };
  document.getElementById("roleSelect").addEventListener("change", populatePersonSelect);
  populatePersonSelect();
  
  // Guarda datos en LocalStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem("fixedAssignments", JSON.stringify(fixedAssignments));
      localStorage.setItem("availability", JSON.stringify(availability));
      alert("Datos guardados localmente.");
    } catch (error) {
      alert("Error al guardar en LocalStorage.");
      console.error(error);
    }
  };
  
  // Carga datos desde LocalStorage
  const loadFromLocalStorage = () => {
    try {
      const loadedAssignments = localStorage.getItem("fixedAssignments");
      const loadedAvailability = localStorage.getItem("availability");
      if (loadedAssignments) fixedAssignments = JSON.parse(loadedAssignments);
      if (loadedAvailability) availability = JSON.parse(loadedAvailability);
      alert("Datos cargados desde LocalStorage.");
      populateAvailabilityList();
    } catch (error) {
      alert("Error al cargar desde LocalStorage.");
      console.error(error);
    }
  };
  
  // Llena la lista de disponibilidad con un checkbox por persona
  const populateAvailabilityList = () => {
    const availListDiv = document.getElementById("availabilityList");
    availListDiv.innerHTML = "";
    const key = getAvailabilityKey();
    const savedAvailability = (availability[key] && availability[key].length > 0)
      ? availability[key]
      : persons.map(p => p.name);
    
    persons.forEach(p => {
      const container = document.createElement("div");
      container.classList.add("checkbox-container");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = p.name;
      checkbox.id = `avail_${p.name.replace(/\s+/g, '_')}`;
      checkbox.checked = savedAvailability.includes(p.name);
      
      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = p.name;
      
      container.appendChild(checkbox);
      container.appendChild(label);
      availListDiv.appendChild(container);
    });
  };
  
  document.getElementById("availWeekSelect").addEventListener("change", populateAvailabilityList);
  document.getElementById("availTurnSelect").addEventListener("change", populateAvailabilityList);
  populateAvailabilityList();
  
  // Guarda la disponibilidad para la semana y turno seleccionados.
  document.getElementById("btnSaveAvailability").addEventListener("click", () => {
    const key = getAvailabilityKey();
    const checkboxes = document.querySelectorAll("#availabilityList input[type='checkbox']");
    const availablePersons = Array.from(checkboxes)
      .filter(chk => chk.checked)
      .map(chk => chk.value);
    availability[key] = availablePersons;
    alert(`Disponibilidad guardada para ${key}`);
  });
  
  // Fija la asignación para un turno y rol.
  document.getElementById("btnFixAssignment").addEventListener("click", () => {
    const week = document.getElementById("weekSelect").value;
    const turno = document.getElementById("turnSelect").value;
    const role = document.getElementById("roleSelect").value;
    const person = document.getElementById("personSelect").value;
    const key = `${week}-${turno}`;
    
    if (!fixedAssignments[key]) {
      fixedAssignments[key] = { capitan: null, publicadores: [null, null, null] };
    }
    if (role === "capitan") {
      fixedAssignments[key].capitan = person;
    } else if (role.startsWith("publicador")) {
      const index = parseInt(role.slice(-1)) - 1;
      fixedAssignments[key].publicadores[index] = person;
    }
    alert(`Turno fijado para ${key} en rol ${role}: ${person}`);
  });
  
  // Función para asignar turnos usando selección ponderada.
  function weightedRandomCandidate(candidates, counts) {
    let totalWeight = 0;
    const weights = candidates.map(candidate => {
      const weight = 1 / (counts[candidate] + 1);
      totalWeight += weight;
      return weight;
    });
    let random = Math.random() * totalWeight;
    for (let i = 0; i < candidates.length; i++) {
      random -= weights[i];
      if (random <= 0) return candidates[i];
    }
    return candidates[candidates.length - 1];
  }
  
  // Genera el calendario con asignaciones fijas, disponibilidad y selección ponderada.
  document.getElementById("btnGenerateSchedule").addEventListener("click", generateSchedule);
  
  function generateSchedule() {
    const allowMultiple = document.getElementById("allowMultipleCheckbox").checked;
    const turnos15 = document.getElementById("turnos15Checkbox").checked;
    let localCounts = {};
    persons.forEach(p => { localCounts[p.name] = 0; });
    
    const weeks = turnos15 ? ["S1", "S2"] : ["S1", "S2", "S3", "S4"];
    const turnos = ["MM", "MT1", "MT2", "XT1", "XT2", "J", "VT1", "VT2", "S", "D"];
    let scheduleResults = [];
    
    weeks.forEach(week => {
      let assigned = {};
      turnos.forEach(turno => {
        const key = `${week}-${turno}`;
        let shiftAssignment = { week, turno, capitan: null, publicadores: [null, null, null] };
        
        if (fixedAssignments[key]) {
          if (fixedAssignments[key].capitan) {
            shiftAssignment.capitan = fixedAssignments[key].capitan;
            if (!allowMultiple) assigned[fixedAssignments[key].capitan] = true;
            localCounts[fixedAssignments[key].capitan]++;
          }
          fixedAssignments[key].publicadores.forEach((p, i) => {
            if (p) {
              shiftAssignment.publicadores[i] = p;
              if (!allowMultiple) assigned[p] = true;
              localCounts[p]++;
            }
          });
        }
        
        let availableForShift = availability[key] ? [...availability[key]] : persons.map(p => p.name);
        const filterCandidates = (candidates, condition) => {
          return candidates.filter(name => {
            if (!allowMultiple && assigned[name]) return false;
            const personObj = persons.find(p => p.name === name);
            return personObj && condition(personObj);
          });
        };
        
        if (!shiftAssignment.capitan) {
          const candidates = filterCandidates(availableForShift, person => person.isCaptain);
          if (candidates.length > 0) {
            const chosen = weightedRandomCandidate(candidates, localCounts);
            shiftAssignment.capitan = chosen;
            if (!allowMultiple) assigned[chosen] = true;
            localCounts[chosen]++;
          } else {
            shiftAssignment.capitan = "Sin asignar";
          }
        }
        
        for (let i = 0; i < 3; i++) {
          if (!shiftAssignment.publicadores[i]) {
            const candidates = filterCandidates(availableForShift, person => true);
            if (candidates.length > 0) {
              const chosen = weightedRandomCandidate(candidates, localCounts);
              shiftAssignment.publicadores[i] = chosen;
              if (!allowMultiple) assigned[chosen] = true;
              localCounts[chosen]++;
            } else {
              shiftAssignment.publicadores[i] = "Sin asignar";
            }
          }
        }
        
        scheduleResults.push(shiftAssignment);
      });
    });
    
    if (turnos15) {
      const duplicates = scheduleResults.map(shift => {
        let newWeek = shift.week === "S1" ? "S3" : shift.week === "S2" ? "S4" : shift.week;
        return { week: newWeek, turno: shift.turno, capitan: shift.capitan, publicadores: [...shift.publicadores] };
      });
      scheduleResults = scheduleResults.concat(duplicates);
    }
    
    displaySchedule(scheduleResults);
  }
  
  // Mapas para estilos en el calendario
  const turnoMapping = {
    "MM": "day-lunes",
    "MT1": "day-martes-1",
    "MT2": "day-martes-2",
    "XT1": "day-miercoles-1",
    "XT2": "day-miercoles-2",
    "J": "day-jueves",
    "VT1": "day-viernes-1",
    "VT2": "day-viernes-2",
    "S": "day-sabado",
    "D": "day-domingo"
  };
  const weekMapping = {
    "S1": "week-S1",
    "S2": "week-S2",
    "S3": "week-S3",
    "S4": "week-S4"
  };
  
  function displaySchedule(scheduleResults) {
    const container = document.getElementById("scheduleTableContainer");
    container.innerHTML = "";
    const table = document.createElement("table");
    table.className = "schedule-table";
    
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Semana", "Turno", "Capitán", "Publicador 1", "Publicador 2", "Publicador 3"].forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = document.createElement("tbody");
    scheduleResults.forEach(item => {
      const row = document.createElement("tr");
      const tdWeek = document.createElement("td");
      tdWeek.textContent = item.week;
      const weekClass = weekMapping[item.week];
      if (weekClass) tdWeek.classList.add(weekClass);
      row.appendChild(tdWeek);
      
      const dayClass = turnoMapping[item.turno] || "";
      const tdTurno = document.createElement("td");
      tdTurno.textContent = item.turno;
      if (dayClass) tdTurno.classList.add(dayClass);
      row.appendChild(tdTurno);
      
      const tdCap = document.createElement("td");
      tdCap.textContent = item.capitan;
      if (dayClass) tdCap.classList.add(dayClass);
      row.appendChild(tdCap);
      
      item.publicadores.forEach(pub => {
        const tdPub = document.createElement("td");
        tdPub.textContent = pub;
        if (dayClass) tdPub.classList.add(dayClass);
        row.appendChild(tdPub);
      });
      
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);
    
    analyzeAssignments(scheduleResults);
  }
  
  // Analiza asignaciones y muestra turnos por persona.
  function analyzeAssignments(scheduleResults) {
    let counts = {};
    persons.forEach(p => { counts[p.name] = 0; });
    scheduleResults.forEach(shift => {
      if (shift.capitan && shift.capitan !== "Sin asignar") counts[shift.capitan]++;
      shift.publicadores.forEach(pub => {
        if (pub && pub !== "Sin asignar") counts[pub]++;
      });
    });
    let analysisContainer = document.getElementById("assignmentAnalysis");
    if (!analysisContainer) {
      analysisContainer = document.createElement("div");
      analysisContainer.id = "assignmentAnalysis";
      analysisContainer.style.marginTop = "20px";
      document.getElementById("scheduleSection").appendChild(analysisContainer);
    }
    analysisContainer.innerHTML = "";
    const heading = document.createElement("h3");
    heading.textContent = "Resumen de Asignaciones";
    analysisContainer.appendChild(heading);
    const list = document.createElement("ul");
    persons.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.name}: ${counts[p.name]} turno(s)`;
      li.style.color = counts[p.name] === 0 ? "red" : "green";
      list.appendChild(li);
    });
    analysisContainer.appendChild(list);
  }
  
  // Exporta un PDF bonito con colores usando jsPDF y AutoTable.
  function generateReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt');
    const meetingDay = document.getElementById('meetingDay').value;
    const records = Object.values(attendanceRecords).filter(r => r.meetingDay === meetingDay);
    
    if (records.length === 0) {
      alert('⚠️ No hay registros para este día');
      return;
    }
    
    // Encabezado del PDF
    doc.setFontSize(18);
    doc.setTextColor(40, 62, 80);
    doc.text(`Reporte de Asistencia - ${meetingDay.toUpperCase()}`, 40, 40);
    
    const headers = [["Nombre", "Estado", "Fecha"]];
    const data = records.map(r => [
      r.name,
      { content: r.status.toUpperCase(), styles: { fillColor: getColor(r.status) } },
      r.date
    ]);
    
    doc.autoTable({
      startY: 60,
      head: headers,
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 12 },
      bodyStyles: { fontSize: 10, cellPadding: 5 },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      styles: { halign: 'center' },
      margin: { left: 40, right: 40 }
    });
    
    doc.save(`Reporte_Asistencia_${meetingDay}_${new Date().toISOString().split('T')[0]}.pdf`);
  }
  
  // Función que devuelve el color (RGB) según el estado.
  function getColor(status) {
    const colors = {
      presencial: [39, 174, 96],
      zoom: [41, 128, 185],
      ausente: [192, 57, 43]
    };
    return colors[status];
  }
  
  // Inicializa las tarjetas de asistencia.
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
      
      // Evento para cada botón de estado.
      card.querySelectorAll('.status-btn').forEach(button => {
        button.addEventListener('click', () => {
          const status = button.dataset.status;
          const meetingDay = document.getElementById('meetingDay').value;
          const date = new Date().toLocaleString();
          
          // Si ya hay registro para esta persona en el turno, se notifica.
          if (attendanceRecords[person.name] && attendanceRecords[person.name].meetingDay === meetingDay) {
            alert('Ya se ha ingresado un dato para esta persona. Para corregir, presiona "Corregir".');
            return;
          }
          
          // Actualiza estilos: marca el botón seleccionado y bloquea los demás.
          card.querySelectorAll('.status-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.style.opacity = '0.7';
            btn.disabled = true;
          });
          button.classList.add('selected');
          button.style.opacity = '1';
          
          // Crea el registro de asistencia.
          const record = {
            id: person.name,
            name: person.name,
            status: status,
            date: date,
            meetingDay: meetingDay
          };
          attendanceRecords[person.name] = record;
          historyRecords.push(record);
          updateHistory(record);
          
          // Agrega botón de corrección (si no existe ya).
          if (!card.querySelector('.correct-btn')) {
            const correctBtn = document.createElement('button');
            correctBtn.textContent = 'Corregir';
            correctBtn.className = 'correct-btn';
            correctBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              delete attendanceRecords[person.name];
              card.querySelectorAll('.status-btn').forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('selected');
                btn.style.opacity = '0.7';
              });
              correctBtn.remove();
              historyRecords = historyRecords.filter(r => !(r.id === person.name && r.meetingDay === meetingDay));
              updateHistoryDisplay();
            });
            card.appendChild(correctBtn);
          }
        });
      });
      
      container.appendChild(card);
    });
  }
  
  // Actualiza el historial visual (completo).
  function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = "";
    historyRecords.forEach(record => {
      let borderClass = "";
      if(record.status === 'presencial') borderClass = 'presencial-border';
      else if(record.status === 'zoom') borderClass = 'zoom-border';
      else if(record.status === 'ausente') borderClass = 'ausente-border';
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
  
  // Inicia la app al cargar el DOM.
  window.addEventListener('DOMContentLoaded', initializeApp);
  
  // Eventos para almacenamiento en LocalStorage.
  document.getElementById("btnSaveStorage").addEventListener("click", saveToLocalStorage);
  document.getElementById("btnLoadStorage").addEventListener("click", loadFromLocalStorage);
  
  // Evento para generar el calendario.
  document.getElementById("btnGenerateSchedule").addEventListener("click", generateSchedule);
  
  // Evento para exportar el reporte en PDF.
  document.getElementById("btnGeneratePDF").addEventListener("click", generateReport);
});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration.scope);
      })
      .catch(error => {
        console.error('Registro de Service Worker fallido:', error);
      });
  });
}
