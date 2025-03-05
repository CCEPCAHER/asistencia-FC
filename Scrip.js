
  let fixedAssignments = {};
  let availability = {};
  
  // Utilidad para obtener la clave de disponibilidad según semana y turno
  const getAvailabilityKey = () => {
    const week = document.getElementById("availWeekSelect").value;
    const turno = document.getElementById("availTurnSelect").value;
    return `${week}-${turno}`;
  };
  
  // Función para llenar el dropdown de personas según el rol seleccionado.
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
  
  // Función para guardar los datos en LocalStorage.
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem("fixedAssignments", JSON.stringify(fixedAssignments));
      localStorage.setItem("availability", JSON.stringify(availability));
      alert("Datos guardados localmente.");
    } catch (error) {
      alert("Error al guardar los datos en LocalStorage.");
      console.error(error);
    }
  };
  
  // Función para cargar los datos desde LocalStorage.
  const loadFromLocalStorage = () => {
    try {
      const loadedAssignments = localStorage.getItem("fixedAssignments");
      const loadedAvailability = localStorage.getItem("availability");
      if (loadedAssignments) fixedAssignments = JSON.parse(loadedAssignments);
      if (loadedAvailability) availability = JSON.parse(loadedAvailability);
      alert("Datos cargados desde LocalStorage.");
      populateAvailabilityList();
    } catch (error) {
      alert("Error al cargar los datos desde LocalStorage.");
      console.error(error);
    }
  };
  
  // Función para llenar la lista de disponibilidad con un checkbox por cada persona.
  const populateAvailabilityList = () => {
    const availListDiv = document.getElementById("availabilityList");
    availListDiv.innerHTML = "";
    const key = getAvailabilityKey();
    // Si no hay datos guardados, por defecto todas están disponibles.
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
  
  // Genera el calendario aplicando asignaciones fijas, disponibilidad y restricciones.
  document.getElementById("btnGenerateSchedule").addEventListener("click", generateSchedule);
  
  function generateSchedule() {
    const allowMultiple = document.getElementById("allowMultipleCheckbox").checked;
    const turnos15 = document.getElementById("turnos15Checkbox").checked;
    
    const weeks = turnos15 ? ["S1", "S2"] : ["S1", "S2", "S3", "S4"];
    const turnos = ["MM", "MT1", "MT2", "XT1", "XT2", "J", "VT1", "VT2", "S", "D"];
    let scheduleResults = [];
    
    weeks.forEach(week => {
      let assigned = {};
      turnos.forEach(turno => {
        const key = `${week}-${turno}`;
        let shiftAssignment = { week, turno, capitan: null, publicadores: [null, null, null] };
        
        // Aplicar asignaciones fijas.
        if (fixedAssignments[key]) {
          if (fixedAssignments[key].capitan) {
            shiftAssignment.capitan = fixedAssignments[key].capitan;
            if (!allowMultiple) assigned[fixedAssignments[key].capitan] = true;
          }
          fixedAssignments[key].publicadores.forEach((p, i) => {
            if (p) {
              shiftAssignment.publicadores[i] = p;
              if (!allowMultiple) assigned[p] = true;
            }
          });
        }
        
        // Lista de disponibles para el turno.
        let availableForShift = availability[key] ? [...availability[key]] : persons.map(p => p.name);
        
        const filterCandidates = (candidates, condition) => {
          return candidates.filter(name => {
            if (!allowMultiple && assigned[name]) return false;
            const personObj = persons.find(p => p.name === name);
            return personObj && condition(personObj);
          });
        };
        
        // Asigna el capitán si aún no se ha fijado.
        if (!shiftAssignment.capitan) {
          const candidates = filterCandidates(availableForShift, person => person.isCaptain);
          if (candidates.length > 0) {
            const chosen = candidates[Math.floor(Math.random() * candidates.length)];
            shiftAssignment.capitan = chosen;
            if (!allowMultiple) assigned[chosen] = true;
          } else {
            shiftAssignment.capitan = "Sin asignar";
          }
        }
        
        // Asigna los 3 publicadores.
        for (let i = 0; i < 3; i++) {
          if (!shiftAssignment.publicadores[i]) {
            const candidates = filterCandidates(availableForShift, person => true);
            if (candidates.length > 0) {
              const chosen = candidates[Math.floor(Math.random() * candidates.length)];
              shiftAssignment.publicadores[i] = chosen;
              if (!allowMultiple) assigned[chosen] = true;
            } else {
              shiftAssignment.publicadores[i] = "Sin asignar";
            }
          }
        }
        
        scheduleResults.push(shiftAssignment);
      });
    });
    
    // Si está activada la opción "Turnos cada 15 días", duplicamos las asignaciones.
    if (turnos15) {
      const duplicates = scheduleResults.map(shift => {
        let newWeek = shift.week === "S1" ? "S3" : shift.week === "S2" ? "S4" : shift.week;
        return {
          week: newWeek,
          turno: shift.turno,
          capitan: shift.capitan,
          publicadores: [...shift.publicadores]
        };
      });
      scheduleResults = scheduleResults.concat(duplicates);
    }
    
    displaySchedule(scheduleResults);
  }
  
  // Muestra el calendario en forma de tabla.
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
      row.appendChild(tdWeek);
      
      const tdTurno = document.createElement("td");
      tdTurno.textContent = item.turno;
      row.appendChild(tdTurno);
      
      const tdCap = document.createElement("td");
      tdCap.textContent = item.capitan;
      row.appendChild(tdCap);
      
      item.publicadores.forEach(pub => {
        const tdPub = document.createElement("td");
        tdPub.textContent = pub;
        row.appendChild(tdPub);
      });
      
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);
  }
  
  // Asignar eventos a botones de almacenamiento.
  document.getElementById("btnSaveStorage").addEventListener("click", saveToLocalStorage);
  document.getElementById("btnLoadStorage").addEventListener("click", loadFromLocalStorage);
});