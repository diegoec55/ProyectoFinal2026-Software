// let heartRateChart
// let oxygenChart
let healthChart
let updateInterval = null
const currentUserId = localStorage.getItem('userId')
const currentUserRole = localStorage.getItem('userRole')

// boton de cerrar sesion
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear()
    window.location.href = '/login.html'
})

// Control de flujo inicial segun el Rol del usuario logueado
async function init() {
    if (!currentUserId) {
        window.location.href = '/login.html'
        return
    }

    if (currentUserRole === 'carer') {
        // Si es cuidador, mostramos el selector y cargamos sus pacientes
        document.getElementById('carer-section').style.display = 'block'
        document.getElementById('last-record').textContent = 'Por favor, seleccione un paciente para monitorear.'
        await loadAssignedPatients()
    } else {
        // Si es paciente, monitorea sus propios datos inmediatamente
        document.getElementById('monitor-title').textContent = 'Última medición (Tus datos)'
        loadData(currentUserId)
        updateInterval = setInterval(() => loadData(currentUserId), 5000)
    }

    if (currentUserRole === 'admin') {
        document.getElementById('admin-panel-btn').style.display = 'inline-block'
    }
}

// Cargar la lista de pacientes que tiene a cargo este Cuidador
async function loadAssignedPatients() {
    try {
        // Llamamos al endpoint que armamos en las rutas del carer
        const res = await fetch(`/api/carers/${currentUserId}/patients`)
        const patients = await res.json()
        
        const select = document.getElementById('patient-select')
        
        patients.forEach(patient => {
            const option = document.createElement('option')
            option.value = patient.id
            option.textContent = `${patient.name} ${patient.lastName}`
            select.appendChild(option)
        })

        // Escuchar cuando el cuidador cambie de paciente en el desplegable
        select.addEventListener('change', (e) => {
            const selectedPatientId = e.target.value
            
            // Limpiar intervalos previos si existían
            if (updateInterval) clearInterval(updateInterval)

            if (!selectedPatientId) {
                document.getElementById('last-record').textContent = 'Por favor, seleccione un paciente para monitorear.'
                document.getElementById('table-record').innerHTML = ''
                if (healthChart) healthChart.destroy()
                return
            }

            // Cambiar titulo y activar bucle para el paciente elegido
            const selectedText = select.options[select.selectedIndex].text
            document.getElementById('monitor-title').textContent = `Última medición de: ${selectedText}`
            
            loadData(selectedPatientId)
            updateInterval = setInterval(() => loadData(selectedPatientId), 5000)
        })

    } catch (error) {
        console.error('Error cargando pacientes:', error)
    }
}

// Cargar datos medicos pasando el ID del usuario como parametro dinamico
async function loadData(userId) {
    try {
        // Ajustamos la ruta para pedir los datos del usuario especifico (tuyo o de tu paciente)
        const res = await fetch(`/api/health/user/${userId}`) 
        const records = await res.json()

        if (!records || !records.length) {
            document.getElementById('last-record').textContent = 'No hay mediciones registradas.'
            document.getElementById('table-record').innerHTML = ''
            if (healthChart) healthChart.destroy()
            return
        }

        const ultima = records[0]

        document.getElementById('last-record').innerHTML = `
            BPM: ${ultima.heart_rate}<br>
            SpO₂: ${ultima.blood_oxygen}%<br>
            Temp: ${ultima.temperature}°C<br>
            Caída: ${ultima.fall_detected ? '<span style="color:red; font-weight:bold;">Sí (Alerta)</span>' : 'No'}
        `

        const table = document.getElementById('table-record')
        table.innerHTML = ''

        records.forEach(record => {
            table.innerHTML += `
                <tr>
                    <td>${new Date(record.createdAt).toLocaleString()}</td>
                    <td>${record.heart_rate}</td>
                    <td>${record.blood_oxygen}</td>
                    <td>${record.temperature}</td>
                    <td style="color: ${record.fall_detected ? 'red' : 'inherit'}">
                        ${record.fall_detected ? 'Sí' : 'No'}
                    </td>
                </tr>
            `
        })

        crearGraficos(records)

    } catch (error) {
        console.error('Error al cargar mediciones:', error)
    }
}

function crearGraficos(records) {

    const labels = records.slice().reverse().map(record => new Date(record.createdAt).toLocaleTimeString())
    const bpmData = records.slice().reverse().map(record => record.heart_rate)
    const oxygenData = records.slice().reverse().map(record => record.blood_oxygen)

    if (healthChart) {
        healthChart.destroy()
    }

    healthChart = new Chart(
        document.getElementById('healthChart'),
        {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'BPM',
                        data: bpmData,
                        tension: 0.3
                    },
                    {
                        label: 'SpO₂ (%)',
                        data: oxygenData,
                        tension: 0.3
                    }
                ]
            },

            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monitoreo de Signos Vitales'
                    }
                }
            }
        }
    )
}

init()

// function createChart(records) {

//     const labels = records
//         .slice()
//         .reverse()
//         .map(record => new Date(record.createdAt).toLocaleTimeString())

//     const bpmData = records
//         .slice()
//         .reverse()
//         .map(record => record.heart_rate)

//     const oxygenData = records
//         .slice()
//         .reverse()
//         .map(record => record.blood_oxygen)

//     // BPM
//     if (heartRateChart) {
//         heartRateChart.destroy()
//     }

//     heartRateChart = new Chart(
//         document.getElementById('heartRateChart'),
//         {
//             type: 'line',

//             data: {
//                 labels,

//                 datasets: [{
//                     label: 'BPM',
//                     data: bpmData
//                 }]
//             }
//         }
//     )

//     // Oxígeno
//     if (oxygenChart) {
//         oxygenChart.destroy()
//     }

//     oxygenChart = new Chart(
//         document.getElementById('oxygenChart'),
//         {
//             type: 'line',

//             data: {
//                 labels,

//                 datasets: [{
//                     label: 'SpO₂ (%)',
//                     data: oxygenData
//                 }]
//             }
//         }
//     )
// }
