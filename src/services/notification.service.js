const axios = require('axios')
require('dotenv').config();

exports.sendWhatsApp = async (phone, message) => {

    try {
        const apiKey = process.env.PHONE_API_KEY

        // Eliminar todo lo que no sea un número
        phone = phone.replace(/\D/g, '')

        // Si comienza con 0, quitarlo
        if (phone.startsWith('0')) {
            phone = phone.substring(1)
        }
        
        const url =
            `https://api.callmebot.com/whatsapp.php?phone=549${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`

        const response = await axios.get(url)

        console.log('WhatsApp enviado')

        return response.data

    } catch (error) {
        console.error('Error enviando WhatsApp')
        console.error(error.response?.data || error.message)
    }
}