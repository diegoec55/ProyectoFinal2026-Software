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

function crearGraficos(records) {

    const labels = records
        .slice()
        .reverse()
        .map(record => new Date(record.createdAt).toLocaleTimeString())

    const bpmData = records
        .slice()
        .reverse()
        .map(record => record.heart_rate)

    const oxygenData = records
        .slice()
        .reverse()
        .map(record => record.blood_oxygen)

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

function createChart(records) {

    const labels = records
        .slice()
        .reverse()
        .map(record => new Date(record.createdAt).toLocaleTimeString())

    const bpmData = records
        .slice()
        .reverse()
        .map(record => record.heart_rate)

    const oxygenData = records
        .slice()
        .reverse()
        .map(record => record.blood_oxygen)

    // BPM
    if (heartRateChart) {
        heartRateChart.destroy()
    }

    heartRateChart = new Chart(
        document.getElementById('heartRateChart'),
        {
            type: 'line',

            data: {
                labels,

                datasets: [{
                    label: 'BPM',
                    data: bpmData
                }]
            }
        }
    )

    // Oxígeno
    if (oxygenChart) {
        oxygenChart.destroy()
    }

    oxygenChart = new Chart(
        document.getElementById('oxygenChart'),
        {
            type: 'line',

            data: {
                labels,

                datasets: [{
                    label: 'SpO₂ (%)',
                    data: oxygenData
                }]
            }
        }
    )
}

async function loadData() {

    try {
        const res = await fetch('/api/data')
        const records = await res.json()

        if (!records.length) {
            document.getElementById('last-record').textContent = 'No hay mediciones'
            return
        }

        const ultima = records[0]

        document.getElementById('last-record').innerHTML = `
            BPM: ${ultima.heart_rate}<br>
            SpO₂: ${ultima.blood_oxygen}%<br>
            Temp: ${ultima.temperature}°C<br>
            Caída: ${ultima.fall_detected ? 'Sí' : 'No'}
        `

        const table = document.getElementById('table-record')

        table.innerHTML = ''

        records.forEach(record => {

            table.innerHTML += `
                <tr>
                    <td>
                        ${new Date(record.createdAt).toLocaleString()}
                    </td>

                    <td>
                        ${record.heart_rate}
                    </td>

                    <td>
                        ${record.blood_oxygen}
                    </td>

                    <td>
                        ${record.temperature}
                    </td>

                    <td>
                        ${record.fall_detected ? 'Sí' : 'No'}
                    </td>
                </tr>
            `
        })

        crearGraficos(records)

    } catch (error) {
        console.error(error)
    }
}

loadData()

setInterval(loadData, 5000)