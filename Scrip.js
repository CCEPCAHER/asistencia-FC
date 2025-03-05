// Lista de personas (según la información proporcionada)
// Se incluye la propiedad isCaptain = true para quienes tienen rol "Capitán".
const persons = [
  { name: "Lola Aradilla", isCaptain: false },
  { name: "Sara Baño", isCaptain: false },
  { name: "Salvador Cadenas", isCaptain: true },
  { name: "Montse (hija) Cadenas", isCaptain: false },
  { name: "Montse de Cadenas", isCaptain: false },
  { name: "Antonia Carpintero", isCaptain: false },
  { name: "Franklin Carranza", isCaptain: true },
  { name: "Vanessa de Carranza", isCaptain: false },
  { name: "Sandra Carvajal", isCaptain: false },
  { name: "Rosa Corpas", isCaptain: false },
  { name: "Alejandro Correa", isCaptain: false },
  { name: "Isabel Cortés", isCaptain: false },
  { name: "Erika Góngora", isCaptain: false },
  { name: "Rosario González", isCaptain: false },
  { name: "Alejandro Hernández", isCaptain: false },
  { name: "Gloria Hernández", isCaptain: false },
  { name: "Javier Hernández", isCaptain: false },
  { name: "Montse de Hernández", isCaptain: false },
  { name: "Débora de Hosu", isCaptain: false },
  { name: "Samuel Hosu", isCaptain: false },
  { name: "Argentina Jiménez", isCaptain: false },
  { name: "Eliana Julián", isCaptain: false },
  { name: "Remedios Ligero", isCaptain: false },
  { name: "Olga Lópes 1", isCaptain: false },
  { name: "Iris López", isCaptain: false },
  { name: "Abigaíl López", isCaptain: false },
  { name: "Francisco López", isCaptain: false },
  { name: "Mª Carmen Lucía", isCaptain: false },
  { name: "Marta Martinez", isCaptain: false },
  { name: "Cristina de Mínguez", isCaptain: false },
  { name: "Francisco Mínguez", isCaptain: false },
  { name: "Segundo Miranda", isCaptain: false },
  { name: "María Montaño", isCaptain: false },
  { name: "Encarna de Moreno", isCaptain: false },
  { name: "José Moreno", isCaptain: true },
  { name: "Estéfany Muñoz", isCaptain: false },
  { name: "Jakeline Muñoz", isCaptain: false },
  { name: "Jimmy Muñoz", isCaptain: false },
  { name: "Samuel Ordoñez", isCaptain: true },
  { name: "Zulema de Ordoñez", isCaptain: false },
  { name: "Beatriz de Palomar", isCaptain: false },
  { name: "Claudio Palomar", isCaptain: false },
  { name: "Luis Fernando Paz", isCaptain: true },
  { name: "Joselma Pereira", isCaptain: false },
  { name: "Remedios Pérez", isCaptain: false },
  { name: "Santiago Quimbayo", isCaptain: false },
  { name: "Sara de Quimbayo", isCaptain: false },
  { name: "Sebastián Rodríguez", isCaptain: false },
  { name: "Javier Rodriguez", isCaptain: false },
  { name: "Teresa de Rodríguez", isCaptain: false },
  { name: "Aitana Ruíz", isCaptain: false },
  { name: "Eliú Ruíz", isCaptain: false },
  { name: "Juan Tomás Ruíz", isCaptain: false },
  { name: "Mireia de Ruíz", isCaptain: false },
  { name: "Rosa de Ruíz", isCaptain: false },
  { name: "Juan Sabio", isCaptain: false },
  { name: "Laura de Sabio", isCaptain: false },
  { name: "Francisco Sánchez", isCaptain: false },
  { name: "Ericka Sánchez", isCaptain: false },
  { name: "Julissa de Soria", isCaptain: false },
  { name: "Pablo Soria", isCaptain: false },
  { name: "Juan Luis Torres", isCaptain: false },
  { name: "Mercedes de Torres", isCaptain: false },
  { name: "Cristihan Valdivieso", isCaptain: false },
  { name: "Encarna de Velarde", isCaptain: false },
  { name: "Ethelinda Velázquez", isCaptain: false },
  { name: "Manoli de Vich", isCaptain: false }
];

// Objeto para almacenar asignaciones fijas. La clave se formará como "S1-MM".
const fixedAssignments = {};  
// Objeto para almacenar la disponibilidad: fixedAssignments y availability tienen clave "semana-turno".
const availability = {};

// Cuando se carga la página, se llena el dropdown de personas según el rol en la sección de asignación fija.
function populatePersonSelect() {
  const role = document.getElementById("roleSelect").value;
  const personSelect = document.getElementById("personSelect");
  personSelect.innerHTML = "";

  let filtered;
  if (role === "capitan") {
    // Solo quienes tienen isCaptain true
    filtered = persons.filter(p => p.isCaptain);
  } else {
    // Para publicadores se muestran a todas las personas (incluyendo los que tienen facultades de capitán)
    filtered = persons;
  }
  filtered.forEach(p => {
    const option = document.createElement("option");
    option.value = p.name;
    option.textContent = p.name;
    personSelect.appendChild(option);
  });
}

document.getElementById("roleSelect").addEventListener("change", populatePersonSelect);
populatePersonSelect();  // Llamada inicial
// Guardar asignaciones en LocalStorage
function saveToLocalStorage() {
  localStorage.setItem("fixedAssignments", JSON.stringify(fixedAssignments));
  localStorage.setItem("availability", JSON.stringify(availability));
  alert("Datos guardados localmente.");
}

// Cargar asignaciones desde LocalStorage
function loadFromLocalStorage() {
  const loadedAssignments = localStorage.getItem("fixedAssignments");
  const loadedAvailability = localStorage.getItem("availability");

  if (loadedAssignments) fixedAssignments = JSON.parse(loadedAssignments);
  if (loadedAvailability) availability = JSON.parse(loadedAvailability);
  alert("Datos cargados desde localStorage.");
}

// Ejemplo de uso
loadFromLocalStorage(); // Cargar datos al iniciar la aplicación
// Llama a saveToLocalStorage() cuando necesites guardar los datos.

// Para la sección de disponibilidad, se llena el contenedor con un checkbox por cada persona.
function populateAvailabilityList() {
  const availListDiv = document.getElementById("availabilityList");
  availListDiv.innerHTML = "";
  persons.forEach(p => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = p.name;
    checkbox.id = `avail_${p.name}`;
    // Por defecto, todos estarán marcados como disponibles.
    checkbox.checked = true;

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = p.name;

    const container = document.createElement("div");
    container.appendChild(checkbox);
    container.appendChild(label);

    availListDiv.appendChild(container);
  });
}

document.getElementById("availWeekSelect").addEventListener("change", populateAvailabilityList);
document.getElementById("availTurnSelect").addEventListener("change", populateAvailabilityList);
populateAvailabilityList();

// Guarda la disponibilidad marcada para la semana y turno seleccionados.
document.getElementById("btnSaveAvailability").addEventListener("click", () => {
  const week = document.getElementById("availWeekSelect").value;
  const turno = document.getElementById("availTurnSelect").value;
  const key = `${week}-${turno}`;
  const checkboxes = document.querySelectorAll("#availabilityList input[type='checkbox']");
  let availablePersons = [];
  checkboxes.forEach(chk => {
    if (chk.checked) availablePersons.push(chk.value);
  });
  availability[key] = availablePersons;
  alert(`Disponibilidad guardada para ${key}`);
});

// Asigna de forma fija una persona a un turno y rol (capitán o uno de los slots de publicador).
document.getElementById("btnFixAssignment").addEventListener("click", () => {
  const week = document.getElementById("weekSelect").value;
  const turno = document.getElementById("turnSelect").value;
  const role = document.getElementById("roleSelect").value;  // "capitan" o "publicador1", "publicador2", "publicador3"
  const person = document.getElementById("personSelect").value;
  const key = `${week}-${turno}`;
  if (!fixedAssignments[key]) {
    fixedAssignments[key] = { capitan: null, publicadores: [null, null, null] };
  }
  if (role === "capitan") {
    fixedAssignments[key].capitan = person;
  } else if (role.startsWith("publicador")) {
    let index = parseInt(role.slice(-1)) - 1;  // "publicador1" → índice 0, etc.
    fixedAssignments[key].publicadores[index] = person;
  }
  alert(`Turno fijado para ${key} en rol ${role}: ${person}`);
});

// Función para generar el calendario mensual respetando:
// • Asignaciones fijas (si las hay)
// • Disponibilidad (si no se ha guardado disponibilidad, se asume que todos están disponibles)
// • Restricción: cada turno tiene 1 capitán y 3 publicadores.
// • Opción "Turnos cada 15 días": si está activada, se genera para dos semanas y se replica para S3 y S4.
// • Opción para permitir (o no) que una persona atienda más de un turno en la misma semana.
document.getElementById("btnGenerateSchedule").addEventListener("click", generateSchedule);

function generateSchedule() {
  const allowMultiple = document.getElementById("allowMultipleCheckbox").checked;
  const turnos15 = document.getElementById("turnos15Checkbox").checked;
  
  let weeks;
  if (turnos15) {
    // Se generan asignaciones para dos semanas y luego se duplican.
    weeks = ["S1", "S2"];
  } else {
    weeks = ["S1", "S2", "S3", "S4"];
  }
  
  const turnos = ["MM", "MT1", "MT2", "XT1", "XT2", "J", "VT1", "VT2", "S", "D"];
  let scheduleResults = [];

  weeks.forEach(week => {
    // Si no se permiten turnos repetidos, llevamos un registro de quienes ya han sido asignados en esta semana.
    let assigned = {};
    turnos.forEach(turno => {
      const key = `${week}-${turno}`;
      let shiftAssignment = { week, turno, capitan: null, publicadores: [null, null, null] };

      // Si existe una asignación fija para este turno, la aplicamos.
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

      // Se recoge la lista de disponibles para este turno (si no se definió, se asume que todos están disponibles)
      let availableForShift = availability[key] ? [...availability[key]] : persons.map(p => p.name);

      // Función auxiliar que filtra candidatos, descartando quien ya ha sido asignado (si no se permite repetir)
      const filterCandidates = (candidates, condition) => {
        return candidates.filter(name => {
          if (!allowMultiple && assigned[name]) return false;
          const personObj = persons.find(p => p.name === name);
          return condition(personObj);
        });
      };

      // Asignar capitán si aún no está fijado.
      if (!shiftAssignment.capitan) {
        // Se requieren personas con isCaptain true.
        let candidates = filterCandidates(availableForShift, person => person && person.isCaptain);
        if (candidates.length > 0) {
          let chosen = candidates[Math.floor(Math.random() * candidates.length)];
          shiftAssignment.capitan = chosen;
          if (!allowMultiple) assigned[chosen] = true;
        } else {
          shiftAssignment.capitan = "Sin asignar";
        }
      }

      // Asignar los 3 publicadores.
      for (let i = 0; i < 3; i++) {
        if (!shiftAssignment.publicadores[i]) {
          // Para publicadores se toma a cualquiera (ya que todos son aptos)
          let candidates = filterCandidates(availableForShift, person => !!person);
          if (candidates.length > 0) {
            let chosen = candidates[Math.floor(Math.random() * candidates.length)];
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
  
  // Si la opción "Turnos cada 15 días" está activada, se duplican las asignaciones para la segunda quincena.
  if (turnos15) {
    let duplicates = scheduleResults.map(shift => {
      let newWeek;
      if (shift.week === "S1") newWeek = "S3";
      else if (shift.week === "S2") newWeek = "S4";
      return {
        week: newWeek,
        turno: shift.turno,
        capitan: shift.capitan,
        publicadores: shift.publicadores.slice()
      };
    });
    scheduleResults = scheduleResults.concat(duplicates);
  }

  displaySchedule(scheduleResults);
}

// Función para generar y mostrar la tabla del calendario.
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
