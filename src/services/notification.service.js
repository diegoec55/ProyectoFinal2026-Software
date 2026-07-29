const axios = require('axios')
require('dotenv').config();

exports.sendWhatsApp = async (phone, message) => {

    try {
        const apiKey = process.env.PHONE_API_KEY
        const url =
            `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`

        const response = await axios.get(url)

        console.log('WhatsApp enviado')

        return response.data

    } catch (error) {
        console.error('Error enviando WhatsApp')
        console.error(error.response?.data || error.message)
    }
}