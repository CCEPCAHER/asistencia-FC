document.addEventListener("DOMContentLoaded", function() {
  /******** VARIABLES GLOBALES ********/
  // Definición de los 10 slots (turnos) y 4 ciclos (semanas del ciclo)
  const slots = ["MM", "MT1", "MT2", "XT1", "XT2", "J", "VT1", "VT2", "S", "D"];
  const ciclos = ["S1", "S2", "S3", "S4"];

  // Objeto para asignaciones fijas (clave: "S1-MM", etc.)
  let fixedAssignments = {};  
  // (Opcional) Objeto para disponibilidad extra; en este ejemplo usamos la disponibilidad de cada persona.
  let externalAvailability = {};

  /******** FUNCIONES DE DISPONIBILIDAD ********/
  // Crea un objeto de disponibilidad: para cada ciclo (S1 a S4) cada slot se inicializa en false
  function createAvailabilityObject() {
    const obj = {};
    ciclos.forEach(ciclo => {
      obj[ciclo] = {};
      slots.forEach(slot => {
        obj[ciclo][slot] = false; // Cambia a true si se desea por defecto
      });
    });
    return obj;
  }

  /******** LISTA DE PERSONAS ********/
  // Aquí usamos "personas" (notar que en este ejemplo se utiliza "personas" y no "persons")
  let personas = [];
  if (localStorage.getItem("personas")) {
    try {
      personas = JSON.parse(localStorage.getItem("personas"));
    } catch (e) {
      console.error("Error al parsear personas desde localStorage, usando datos por defecto.");
      personas = getDefaultPersonas();
    }
  } else {
    personas = getDefaultPersonas();
  }

  // Función que retorna el array de 66 personas por defecto (según la información proporcionada)
  function getDefaultPersonas() {
    return [
      { nombre: "Lola Aradilla", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Sara Baño", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Salvador Cadenas", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Montse (hija) Cadenas", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Montse de Cadenas", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Antonia Carpintero", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Franklin Carranza", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Vanessa de Carranza", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Sandra Carvajal", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Rosa Corpas", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Alejandro Correa", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Isabel Cortés", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Erika Góngora", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Rosario González", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Alejandro Hernández", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Gloria Hernández", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Javier Hernández", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Montse de Hernández", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Débora de Hosu", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Samuel Hosu", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Argentina Jiménez", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Eliana Julián", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Remedios Ligero", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Olga Lópes 1", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Iris López", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Abigaíl López", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Francisco López", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Mª Carmen Lucía", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Marta Martinez", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Cristina de Mínguez", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Francisco Mínguez", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Segundo Miranda", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "María Montaño", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Encarna de Moreno", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "José Moreno", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Estéfany Muñoz", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Jakeline Muñoz", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Jimmy Muñoz", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Samuel Ordoñez", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Zulema de Ordoñez", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject(), rotacion: true },
      { nombre: "Beatriz de Palomar", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Claudio Palomar", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Luis Fernando Paz", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Joselma Pereira", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Remedios Pérez", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Santiago Quimbayo", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Sara de Quimbayo", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Sebastián Rodríguez", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Javier Rodriguez", rol: "Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Teresa de Rodríguez", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Aitana Ruíz", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Eliú Ruíz", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Juan Tomás Ruíz", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Mireia de Ruíz", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Rosa de Ruíz", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Juan Sabio", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Laura de Sabio", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Francisco Sánchez", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Ericka Sánchez", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Julissa de Soria", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Pablo Soria", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Juan Luis Torres", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject(), rotacion: true },
      { nombre: "Mercedes de Torres", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Cristihan Valdivieso", rol: "Publicador, Capitán", isCaptain: true, disponibilidad: createAvailabilityObject() },
      { nombre: "Encarna de Velarde", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Ethelinda Velázquez", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject() },
      { nombre: "Manoli de Vich", rol: "Publicador", isCaptain: false, disponibilidad: createAvailabilityObject(), rotacion: true }
    ];
  }

  /******** INTERFAZ: Renderización de Disponibilidad ********/
  function renderPersonsTable() {
    const container = document.getElementById("persons-table-container");
    container.innerHTML = "";
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Cabeceras: Nombre, Rol y cada combinación de slot y ciclo
    const headers = ["Nombre", "Rol"];
    slots.forEach(slot => {
      ciclos.forEach(ciclo => {
        headers.push(`${slot}_${ciclo}`);
      });
    });
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      if (h.includes("_")) {
        const parts = h.split("_");
        th.dataset.ciclo = parts[1];
      }
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    personas.forEach((p, index) => {
      const row = document.createElement("tr");
      const tdName = document.createElement("td");
      tdName.textContent = p.nombre;
      row.appendChild(tdName);
      const tdRole = document.createElement("td");
      tdRole.textContent = p.rol;
      row.appendChild(tdRole);
      // Para cada slot y ciclo, crear una celda con un checkbox
      slots.forEach(slot => {
        ciclos.forEach(ciclo => {
          const td = document.createElement("td");
          td.classList.add("col-" + slot.charAt(0).toLowerCase());
          td.dataset.ciclo = ciclo;
          const cb = document.createElement("input");
          cb.type = "checkbox";
          cb.dataset.personIndex = index;
          cb.dataset.slot = slot;
          cb.dataset.ciclo = ciclo;
          cb.checked = p.disponibilidad[slot][ciclo];
          td.appendChild(cb);
          row.appendChild(td);
        });
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);
  }

  function updatePersonsAvailability() {
    const checkboxes = document.querySelectorAll("#persons-table-container input[type='checkbox']");
    checkboxes.forEach(cb => {
      const idx = cb.dataset.personIndex;
      const slot = cb.dataset.slot;
      const ciclo = cb.dataset.ciclo;
      personas[idx].disponibilidad[slot][ciclo] = cb.checked;
    });
    localStorage.setItem("personas", JSON.stringify(personas));
  }

  renderPersonsTable();

  document.getElementById("save-availability").addEventListener("click", function() {
    updatePersonsAvailability();
    alert("Disponibilidad guardada.");
  });

  /******** CONFIGURACIÓN DE TURNOS SEMANALES ********/
  // Definición de turnos fijos y alternados
  const shifts = [
    {
      day: "Martes",
      time: "10:00-12:30",
      label: "Martes Mañana",
      requiredSlot: "MM",
      fixedCaptain: { enabled: true, name: "José Moreno" },
      fixedPublishers: { enabled: true, fixedPositions: { 1: null, 2: "Encarna Moreno", 3: "Jakeline Muñoz" } }
    },
    {
      day: "Martes",
      time: "16:30-18:30",
      label: "Martes Tarde 1",
      requiredSlot: "MT1",
      fixedCaptain: { enabled: true, alternating: true, options: ["Samuel Ordóñez", "Javier Rodríguez"] },
      fixedPublishers: { enabled: true }
    },
    {
      day: "Martes",
      time: "18:30-20:30",
      label: "Martes Tarde 2",
      requiredSlot: "MT2",
      fixedCaptain: { enabled: false },
      fixedPublishers: { enabled: false }
    },
    {
      day: "Miércoles",
      time: "16:30-18:30",
      label: "Miércoles Tarde 1",
      requiredSlot: "XT1",
      fixedCaptain: { enabled: false },
      fixedPublishers: { enabled: false }
    },
    {
      day: "Miércoles",
      time: "18:30-20:30",
      label: "Miércoles Tarde 2",
      requiredSlot: "XT2",
      fixedCaptain: { enabled: false },
      fixedPublishers: { enabled: false }
    },
    {
      day: "Jueves",
      time: "10:00-12:30",
      label: "Jueves",
      requiredSlot: "J",
      fixedCaptain: { enabled: true, alternating: true, options: ["Juan Luis Torres", "Francisco López"] },
      fixedPublishers: { enabled: false }
    },
    {
      day: "Viernes",
      time: "16:30-18:30",
      label: "Viernes Tarde 1",
      requiredSlot: "VT1",
      fixedCaptain: { enabled: false },
      fixedPublishers: { enabled: false }
    },
    {
      day: "Viernes",
      time: "18:30-20:30",
      label: "Viernes Tarde 2",
      requiredSlot: "VT2",
      fixedCaptain: { enabled: false },
      fixedPublishers: { enabled: false }
    },
    {
      day: "Sábado",
      time: "10:30-13:00",
      label: "Sábado",
      requiredSlot: "S",
      fixedCaptain: { enabled: false },
      fixedPublishers: { enabled: false }
    },
    {
      day: "Domingo",
      time: "10:00-12:00",
      label: "Domingo",
      requiredSlot: "D",
      fixedCaptain: { enabled: false },
      fixedPublishers: { enabled: false }
    }
  ];

  // Función para obtener el número de semana del año
  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  // Función para obtener la clave del ciclo según el número de semana (ciclo de 4 semanas)
  function getCycleKey(weekNumber) {
    const cycle = weekNumber % 4;
    return "S" + (cycle === 0 ? 4 : cycle);
  }

  // Función para filtrar candidatos disponibles para un slot en el ciclo actual.
  // Recibe un array de objetos (personas) y devuelve los que tienen true en ese slot para el ciclo.
  function getAvailableCandidates(candidates, slot, cycleKey) {
    return candidates.filter(person => person.disponibilidad[slot][cycleKey] === true);
  }

  // Función de shuffle para mezclar arreglos
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Función para obtener listas frescas de candidatos (objetos) para turnos sin fijos
  function getFreshCandidates() {
    const candidateCaptains = personas.filter(p => p.rol.includes("Capitán"));
    let nonFixedCaptains = candidateCaptains.filter(p => 
      !shifts.some(s => s.fixedCaptain && s.fixedCaptain.enabled && !s.fixedCaptain.alternating && s.fixedCaptain.name === p.nombre)
    );
    nonFixedCaptains = shuffle(nonFixedCaptains);
    const nonFixedPublishers = shuffle(personas.filter(p => p.rol.includes("Publicador")));
    return { nonFixedCaptains, nonFixedPublishers };
  }

  // Función para generar el schedule para la semana, usando el ciclo actual o uno personalizado
  function generateSchedule(customCycleKey) {
    const schedule = [];
    let cycleKey = customCycleKey ? customCycleKey : getCycleKey(getWeekNumber(new Date()));
    const { nonFixedCaptains, nonFixedPublishers } = getFreshCandidates();

    shifts.forEach(shift => {
      const reqSlot = shift.requiredSlot;
      
      // Asignar capitán
      let captain = "Sin candidato";
      if (shift.fixedCaptain && shift.fixedCaptain.enabled) {
        if (shift.fixedCaptain.alternating) {
          const optionIndex = getWeekNumber(new Date()) % 2;
          captain = shift.fixedCaptain.options[optionIndex];
        } else {
          captain = shift.fixedCaptain.name;
        }
      } else {
        let availableCaptains = getAvailableCandidates(nonFixedCaptains, reqSlot, cycleKey);
        if (availableCaptains.length > 0) {
          captain = availableCaptains[0].nombre;
          // Rotación: reinserta el candidato para futuros turnos
          const idx = nonFixedCaptains.indexOf(availableCaptains[0]);
          if (idx > -1) {
            nonFixedCaptains.splice(idx, 1);
            nonFixedCaptains.push(availableCaptains[0]);
          }
        }
      }
      // Agregar etiqueta " (Capitán)" si corresponde
      const capObj = personas.find(p => p.nombre === captain);
      if (capObj && capObj.rol.includes("Capitán")) {
        captain += " (Capitán)";
      }
      
      // Asignar 3 publicadores
      let assignedPublishers = [];
      let availablePublishers = getAvailableCandidates(nonFixedPublishers, reqSlot, cycleKey)
                                  .filter(p => p.nombre !== captain.replace(" (Capitán)", ""));
      if (availablePublishers.length < 3) {
        assignedPublishers = ["Sin candidato", "Sin candidato", "Sin candidato"];
      } else {
        availablePublishers = shuffle(availablePublishers);
        for (let i = 0; i < 3; i++) {
          let candidate = availablePublishers[i % availablePublishers.length];
          assignedPublishers.push(candidate.nombre);
          const idx = nonFixedPublishers.indexOf(candidate);
          if (idx > -1) {
            nonFixedPublishers.splice(idx, 1);
            nonFixedPublishers.push(candidate);
          }
        }
      }
      
      schedule.push({
        turno: shift.label,
        día: shift.day,
        horario: shift.time,
        ciclo: cycleKey,
        capitán: captain,
        publicadores: assignedPublishers
      });
    });
    return schedule;
  }

  // Función para mostrar el schedule en una tabla, asignando clases según día y ciclo
  function displaySchedule(schedule) {
    const container = document.getElementById("schedule-container");
    container.innerHTML = "";
    const table = document.createElement("table");
    table.classList.add("schedule-table");
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
    schedule.forEach(item => {
      const row = document.createElement("tr");
      row.classList.add("dia-" + item.día.toLowerCase());
      row.classList.add("semana-" + item.ciclo.toLowerCase());
      
      const tdWeek = document.createElement("td");
      tdWeek.textContent = item.ciclo;
      const tdTurno = document.createElement("td");
      tdTurno.textContent = item.turno;
      const tdCap = document.createElement("td");
      tdCap.textContent = item.capitán;
      const tdPub1 = document.createElement("td");
      tdPub1.textContent = item.publicadores[0];
      const tdPub2 = document.createElement("td");
      tdPub2.textContent = item.publicadores[1];
      const tdPub3 = document.createElement("td");
      tdPub3.textContent = item.publicadores[2];
      
      row.appendChild(tdWeek);
      row.appendChild(tdTurno);
      row.appendChild(tdCap);
      row.appendChild(tdPub1);
      row.appendChild(tdPub2);
      row.appendChild(tdPub3);
      
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);
  }

  // Evento para generar turnos usando el selector de ciclo (o el ciclo actual si no se selecciona)
  document.getElementById("generate-turns").addEventListener("click", function() {
    const weekSelector = document.getElementById("week-selector");
    const selectedCycle = weekSelector ? weekSelector.value : getCycleKey(getWeekNumber(new Date()));
    const schedule = generateSchedule(selectedCycle);
    displaySchedule(schedule);
  });

  /******** FUNCIONES AUXILIARES (galerías, pantalla completa, etc.) ********/
  function loadOffersGallery(supermarket) { /* ... */ }
  function loadPromotionsGallery(supermarket) { /* ... */ }
  function openFullScreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  // Persistencia: guardar el array de personas en localStorage
  function savePersonas() {
    localStorage.setItem("personas", JSON.stringify(personas));
  }

  // Al cargar la página, se renderiza la tabla de disponibilidad
  renderPersonsTable();
});
  
// Función para desplazar el carrusel horizontal (si se usa en galerías)
function scrollCarousel(containerId, direction) {
  const container = document.getElementById(containerId);
  const scrollAmount = container.clientWidth * 0.7;
  container.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
}