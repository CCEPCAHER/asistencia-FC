document.addEventListener("DOMContentLoaded", () => {
  // Lista de personas (según la información proporcionada)
  const persons = [
    { name: "Lola Aradilla", isCaptain: false },
    { name: "Laura Andres", isCaptain: false },
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
    { name: "Eliana Julián",
isCaptain: false },
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
    { name: "Ericka Sánchez", isCaptain: true },
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
  let scheduleResults = [];
  let editMode = false;

  // Función para obtener clave de disponibilidad
  const getAvailabilityKey = () => {
    const week = document.getElementById("availWeekSelect").value;
    const turno = document.getElementById("availTurnSelect").value;
    return `${week}-${turno}`;
  };

  // Llenar selector de personas
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

  // Guardar/Cargar LocalStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem("fixedAssignments", JSON.stringify(fixedAssignments));
      localStorage.setItem("availability", JSON.stringify(availability));
      alert("Datos guardados!");
    } catch (error) {
      alert("Error al guardar");
      console.error(error);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const loadedAssignments = localStorage.getItem("fixedAssignments");
      const loadedAvailability = localStorage.getItem("availability");
      if (loadedAssignments) fixedAssignments = JSON.parse(loadedAssignments);
      if (loadedAvailability) availability = JSON.parse(loadedAvailability);
      alert("Datos cargados!");
      populateAvailabilityList();
    } catch (error) {
      alert("Error al cargar");
      console.error(error);
    }
  };

  // Llenar disponibilidad
  const populateAvailabilityList = () => {
    const availListDiv = document.getElementById("availabilityList");
    availListDiv.innerHTML = "";
    const key = getAvailabilityKey();
    const savedAvailability = availability[key] || persons.map(p => p.name);
    
    persons.forEach(p => {
      const container = document.createElement("div");
      container.className = "checkbox-container";
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

  // Event listeners
  document.getElementById("btnSaveAvailability").addEventListener("click", () => {
    const key = getAvailabilityKey();
    const checkboxes = document.querySelectorAll("#availabilityList input[type='checkbox']");
    availability[key] = Array.from(checkboxes)
      .filter(chk => chk.checked)
      .map(chk => chk.value);
    alert(`Disponibilidad guardada para ${key}`);
  });

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
    } else {
      const index = parseInt(role.slice(-1)) - 1;
      fixedAssignments[key].publicadores[index] = person;
    }
    alert(`Asignación fijada: ${key} - ${role}: ${person}`);
  });

  // Generar calendario
  document.getElementById("btnGenerateSchedule").addEventListener("click", generateSchedule);

  function generateSchedule() {
    const allowMultiple = document.getElementById("allowMultipleCheckbox").checked;
    const turnos15 = document.getElementById("turnos15Checkbox").checked;
    
    let localCounts = {};
    persons.forEach(p => localCounts[p.name] = 0);
    
    const weeks = turnos15 ? ["S1", "S2"] : ["S1", "S2", "S3", "S4"];
    const turnos = ["MM", "MT1", "MT2", "XT1", "XT2", "J", "VT1", "VT2", "S", "D"];
    scheduleResults = [];
    
    weeks.forEach(week => {
      turnos.forEach(turno => {
        const key = `${week}-${turno}`;
        let shift = { week, turno, capitan: null, publicadores: [null, null, null] };
        
        // Aplicar asignaciones fijas
        if (fixedAssignments[key]) {
          shift.capitan = fixedAssignments[key].capitan || null;
          shift.publicadores = [...fixedAssignments[key].publicadores];
        }
        
        // Lista de disponibles
        let available = availability[key] || persons.map(p => p.name);
        
        // Asignar capitán
        if (!shift.capitan) {
          const candidates = available.filter(name => 
            persons.find(p => p.name === name)?.isCaptain
          );
          if (candidates.length > 0) {
            shift.capitan = weightedRandom(candidates, localCounts);
            localCounts[shift.capitan]++;
          }
        }
        
        // Asignar publicadores
        for (let i = 0; i < 3; i++) {
          if (!shift.publicadores[i]) {
            const candidates = available.filter(name => 
              !shift.publicadores.includes(name) && name !== shift.capitan
            );
            if (candidates.length > 0) {
              shift.publicadores[i] = weightedRandom(candidates, localCounts);
              localCounts[shift.publicadores[i]]++;
            }
          }
        }
        
        scheduleResults.push(shift);
      });
    });
    
    displaySchedule(scheduleResults);
  }

  function weightedRandom(candidates, counts) {
    const weights = candidates.map(name => 1 / (counts[name] + 1));
    const total = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * total;
    for (let i = 0; i < candidates.length; i++) {
      random -= weights[i];
      if (random <= 0) return candidates[i];
    }
    return candidates[0];
  }

  // Mostrar calendario
  function displaySchedule(results) {
    scheduleResults = results;
    const container = document.getElementById("scheduleTableContainer");
    container.innerHTML = "";
    
    const table = document.createElement("table");
    table.className = "schedule-table";
    
    // Cabecera
    const headerRow = document.createElement("tr");
    ["Semana", "Turno", "Capitán", "Publicador 1", "Publicador 2", "Publicador 3"].forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    
    // Filas
    results.forEach(item => {
      const row = document.createElement("tr");
      
      // Semana
      const weekCell = document.createElement("td");
      weekCell.textContent = item.week;
      weekCell.className = `week-${item.week}`;
      row.appendChild(weekCell);
      
      // Turno
      const turnoCell = document.createElement("td");
      turnoCell.textContent = item.turno;
      turnoCell.className = `day-${item.turno.toLowerCase().replace(/\d/g, '')}`;
      row.appendChild(turnoCell);
      
      // Capitán
      const capCell = document.createElement("td");
      capCell.textContent = item.capitan || "Sin asignar";
      capCell.className = turnoCell.className;
      capCell.setAttribute("data-field", "capitan");
      row.appendChild(capCell);
      
      // Publicadores
      item.publicadores.forEach((pub, index) => {
        const pubCell = document.createElement("td");
        pubCell.textContent = pub || "Sin asignar";
        pubCell.className = turnoCell.className;
        pubCell.setAttribute("data-field", "publicador");
        pubCell.setAttribute("data-index", index);
        row.appendChild(pubCell);
      });
      
      table.appendChild(row);
    });
    
    container.appendChild(table);
    addEditFunctionality();
    analyzeAssignments(results);
  }

  // Funcionalidad de edición
  function addEditFunctionality() {
    const cells = document.querySelectorAll('[data-field]');
    cells.forEach(cell => {
      cell.removeEventListener('click', handleCellClick);
      cell.addEventListener('click', handleCellClick);
    });
  }

  function handleCellClick(e) {
    if (!editMode) return;
    
    const cell = e.target;
    const originalValue = cell.textContent;
    const field = cell.dataset.field;
    const index = cell.dataset.index;
    
    const input = document.createElement('input');
    input.value = originalValue;
    input.style.width = '100%';
    
    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();
    
    const saveEdit = () => {
      const newValue = input.value.trim();
      cell.textContent = newValue;
      
      // Actualizar datos
      const row = cell.closest('tr');
      const week = row.children[0].textContent;
      const turno = row.children[1].textContent;
      
      const assignment = scheduleResults.find(a => 
        a.week === week && a.turno === turno
      );
      
      if (assignment) {
        if (field === "capitan") {
          assignment.capitan = newValue;
        } else if (field === "publicador") {
          assignment.publicadores[index] = newValue;
        }
        analyzeAssignments(scheduleResults);
      }
    };
    
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keypress', (e) => e.key === 'Enter' && saveEdit());
  }

  // Analizar asignaciones
  function analyzeAssignments(results) {
    const counts = persons.reduce((acc, p) => {
      acc[p.name] = 0;
      return acc;
    }, {});
    
    results.forEach(shift => {
      if (shift.capitan && shift.capitan !== "Sin asignar") counts[shift.capitan]++;
      shift.publicadores.forEach(pub => {
        if (pub && pub !== "Sin asignar") counts[pub]++;
      });
    });
    
    let analysisContainer = document.getElementById("assignmentAnalysis");
    if (!analysisContainer) {
      analysisContainer = document.createElement("div");
      analysisContainer.id = "assignmentAnalysis";
      document.getElementById("scheduleSection").appendChild(analysisContainer);
    }
    
    analysisContainer.innerHTML = `
      <h3>Resumen de Asignaciones</h3>
      <ul>
        ${persons.map(p => `
          <li style="color: ${counts[p.name] === 0 ? 'red' : 'green'}">
            ${p.name}: ${counts[p.name]} turnos
          </li>
        `).join('')}
      </ul>
    `;
  }
document.getElementById("btnExportPDF").addEventListener("click", async () => {
  try {
    const table = document.querySelector('.schedule-table');
    if (!table) {
      alert('⚠️ Primero genera el calendario');
      return;
    }

    // Configuración móvil optimizada
    const canvas = await html2canvas(table, {
      scale: 1,
      logging: false,
      useCORS: true,
      scrollY: -window.scrollY
    });

    // Crear imagen en nueva pestaña
    const imgData = canvas.toDataURL('image/png');
    const newWindow = window.open();
    newWindow.document.write(`<img src="${imgData}" style="max-width:100%;">`);
    
    // Opción alternativa para guardar
    const link = document.createElement('a');
    link.download = 'turnos.png';
    link.href = imgData;
    link.click();
    
  } catch (error) {
    alert('📱 Para exportar PDF en iPhone:\n1. Usa Safari\n2. Activa "Bloqueo de Contenido" en Ajustes > Safari\n3. Recarga la página');
  }
});
  // Modo edición
  document.getElementById("btnToggleEdit").addEventListener("click", () => {
    editMode = !editMode;
    const btn = document.getElementById("btnToggleEdit");
    btn.textContent = editMode ? 'Desactivar Edición' : 'Modo Edición';
    btn.style.backgroundColor = editMode ? '#4CAF50' : '';
    document.querySelector('.schedule-table')?.classList.toggle('edit-mode', editMode);
  });

  // Botones de almacenamiento
  document.getElementById("btnSaveStorage").addEventListener("click", saveToLocalStorage);
  document.getElementById("btnLoadStorage").addEventListener("click", loadFromLocalStorage);
});