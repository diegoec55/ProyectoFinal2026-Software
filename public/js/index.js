async function loadData() {

    try {

        const res =
            await fetch('/api/data')

        const records =
            await res.json()

        if (!records.length) {

            document.getElementById(
                'ultima-medicion'
            ).textContent =
                'No hay mediciones'

            return
        }

        const ultima = records[0]

        document.getElementById(
            'ultima-medicion'
        ).innerHTML = `
            BPM: ${ultima.heart_rate}<br>
            SpO₂: ${ultima.blood_oxygen}%<br>
            Temp: ${ultima.temperature}°C<br>
            Caída: ${ultima.fall_detected ? 'Sí' : 'No'}
        `

        const tabla =
            document.getElementById(
                'tabla-mediciones'
            )

        tabla.innerHTML = ''

        records.forEach(record => {

            tabla.innerHTML += `
                <tr>
                    <td>
                        ${new Date(
                            record.createdAt
                        ).toLocaleString()}
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
                        ${record.fall_detected
                            ? 'Sí'
                            : 'No'}
                    </td>
                </tr>
            `
        })

    } catch (error) {

        console.error(error)
    }
}

loadData()

setInterval(loadData, 5000)