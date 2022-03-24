const express = require('express');

const container = require('./clase4.js');


const app = express();

const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
})

server.on('error',error => console.log(`Error en el servidor ${error}`))

app.get('/', (req, res) => {
    res.send({ mensaje: 'Hola Mundo'})
});

app.get ('/productos', (req,res) => {
    container.getAll().then(respuesta => res.send(respuesta))
    
});

app.get ('/productosRandom', (req,res) => {

    container.getAll().then(respuesta => res.send(
        respuesta[Math.floor(Math.random() * respuesta.length)]
        ))

});
