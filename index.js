require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Statik dosyalar için public klasörünü kullan
app.use(express.static('public'));

// Config değerlerini client'a gönder
app.get('/config', (req, res) => {
    res.json({
        TRACCAR_API_URL: process.env.TRACCAR_API_URL,
        TRACCAR_TOKEN: process.env.TRACCAR_TOKEN,
        TRACCAR_DEVICE_ID: process.env.TRACCAR_DEVICE_ID
    });
});

// Ana route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
