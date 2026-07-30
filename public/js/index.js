// let heartRateChart
// let oxygenChart
let healthChart
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
        await loadAssignedPatients()
    } else {
        // Si es paciente, monitorea sus propios datos inmediatamente
        // document.getElementById('monitor-title').textContent = 'Última medición (Tus datos)'
        await loadData(currentUserId)
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
        console.log(res.status)
        const patients = await res.json()
        console.log(patients)
        
        const select = document.getElementById('patient-select')
        
        patients.forEach(patient => {
            const option = document.createElement('option')
            option.value = patient.id
            option.textContent = `${patient.name} ${patient.lastName}`
            select.appendChild(option)
        })

        // Escuchar cuando el cuidador cambie de paciente en el desplegable
        select.addEventListener('change', async (e) => {

            const selectedPatientId = e.target.value

            if (!selectedPatientId) {
                document.getElementById('important-records').innerHTML = ''
                document.getElementById('table-record').innerHTML = ''

                if (healthChart) {
                    healthChart.destroy()
                }
                return
            }

            // Cambiar titulo y activar bucle para el paciente elegido
            const selectedText = select.options[select.selectedIndex].text
            document.getElementById('monitor-title').textContent = `Paciente: ${selectedText}`
            
            await loadData(selectedPatientId)
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
            document.getElementById('important-records').innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;">
                        No hay eventos importantes.
                    </td>
                </tr>
                `

                document.getElementById('table-record').innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;">
                        No hay mediciones registradas.
                    </td>
                </tr>
                `
            if (healthChart) healthChart.destroy()
            return
        }

        renderImportantRecords(records)

        const table = document.getElementById('table-record')
        table.innerHTML = ''

        records.forEach(record => {
            table.innerHTML += `
                <tr>
                    <td>${new Date(record.createdAt).toLocaleString()}</td>
                    <td>${record.heart_rate}</td>
                    <td>${record.blood_oxygen} %</td>
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

function renderImportantRecords(records) {

    const table = document.getElementById('important-records')

    table.innerHTML = ''

    const important = records
        .filter(r => r.fall_detected)

    let result

    if (important.length >= 10) {

        result = important.slice(0,10)

    } else {

        const remaining = 10 - important.length

        const lowOxygen = records
            .filter(r => !r.fall_detected)
            .sort((a,b) => a.blood_oxygen - b.blood_oxygen)
            .slice(0, remaining)

        result = [...important, ...lowOxygen]
    }

    result.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))

    result.forEach(record=>{

        const event = record.fall_detected
            ? "Caída detectada"
            : "Baja saturación"

        table.innerHTML += `
            <tr>
                <td>${new Date(record.createdAt).toLocaleString()}</td>
                <td>${record.heart_rate}</td>
                <td>${record.blood_oxygen}%</td>
                <td style="font-weight:bold;color:${record.fall_detected?'red':'orange'}">
                    ${event}
                </td>
            </tr>
        `
    })
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