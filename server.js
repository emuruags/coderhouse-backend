import express from 'express';
import * as http from 'http';
import * as socket  from 'socket.io';

import Product from './classes/product.js';
import Message from "./classes/message.js";
// import Container from "./classes/container.js";
import { engine } from 'express-handlebars';
import { createProductTable, createMessagesTable, KnexConfiguration } from './utils/utils.js';
import { mySqlDatabase, sqlLite3Database } from './config/configuration.js';


// Chat con Socket.io
const { Server: HttpServer } = http;
const { Server: IOServer } = socket;


const { Router } = express; 


const app = express();

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const router = Router();

const PORT = 8080;

// const container = new Container('messages.txt');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
    })
  );


//----------------- Seteo Pug Begin ---------------------------

app.set('views', './views');

// app.set('view engine', 'ejs');
 app.set('view engine', 'hbs');
// app.set('view engine', 'pug');


//----------------- Seteo Pug End ---------------------------


app.use('/api/products', router);


// Indicamos que queremos cargar los archivos estáticos que se encuentran en dicha carpeta
app.use(express.static('./public'))
// Esta ruta carga nuestro archivo index.html en la raíz de la misma
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
})

server.on('error',error => console.log(`Error en el servidor ${error}`))


createProductTable();
createMessagesTable();
const productsDbUtils = new KnexConfiguration(mySqlDatabase, 'products');
const messagesDbUtils = new KnexConfiguration(sqlLite3Database, 'messages');

let messagesArray = [];
let productsArray = [];



//-----------------------------------------------------
//-------- Configuracion del Socket -------------------
//-----------------------------------------------------



io.on('connection', (socket) => {
    console.log('Cliente conectado');
     
    //socket.emit('messages', messages);
    messagesDbUtils.getAll().then((messages)=>{
        messagesArray = messages;
        socket.emit('messages', messagesArray);
    }).catch(error => console.log(error));

    // socket.emit('products', products);
    productsDbUtils.getAll().then((products)=> {
        productsArray = products;
        socket.emit('products', productsArray); 
    }).catch(error => console.log(error));
  
    socket.on('new-product', function(data) {
    //   products.push(data);
    //   io.sockets.emit('products', products); 
        const product = new Product(undefined, data.title, data.price, data.thumbnails);
        productsDbUtils.insertData(product).then(() => {
        io.sockets.emit('products', productsArray); 
        }).catch(error => console.log(error));
    });    
  
    socket.on('new-message', function(data) {
        // messages.push(data);
        // io.sockets.emit('messages', messages); 
        const message = new Message(data.email, data.dateTime, data.text)
        messagesDbUtils.insertData(message).then(()=>{
            io.sockets.emit('messages', messagesArray);
        }).catch(error => console.log(error));
    });
})






//---------------------------------------------------------------
//-------------------------- TEMPLATES -------------------------

    // TEMPLATE PUG
    // app.get('/productos', (req, res) => {
    //     res.render("pug/view", {
    //     productosView: productos,
    //     productosViewExist: productos.length
    //     });
    // });

    // TEMPLATE HANDLEBARS
    app.get('/products', (req, res) => {
        // res.render("handlebars/view", {
        //     productosView: products,
        //     productosViewExist: products.length
        //     });
        res.render('handlebars/view');
        });
    
    app.post('/products', (req, res) => {
        const id = getMaxId();
        console.log(req.body);
        const product = new Product(id + 1, req.body.title, req.body.price, req.body.thumbnails);
    
        products.push(product);
        res.redirect('/')
    });

    // TEMPLATE EJS
    // app.get('/productos', (req, res) => {
    //     res.render("ejs/view", {
    //     productosView: productos,
    //     productosViewExist: productos.length
    //     });
    // });

    // app.post('/productos', (req, res) => {
    //     const id = getMaxId();
    //     console.log(req.body);
    //     const producto = new Producto(id + 1, req.body.title, req.body.price, req.body.thumbnails);
    
    //     productos.push(producto);
    //     res.redirect('/')
    // });
  


// app.get('/', (req, res) => {
//     res.send({ mensaje: 'Hola Mundo'})
// });

router.get('/', (req, res) => {
    //res.send('get ok')
    try {
        res.json(products);
    } catch (error) {
        res.json({error: '204 no conctent'});
    }
 })

router.get('/:id', (req,res) => {
    //console.log(productos);
    const product = products.find( (x) => parseInt( x.id) === parseInt(req.params.id));       
    //console.log(product);
    if (product) {
        res.json(product)
    } else {
        res.json({ error : '404 producto no encontrado' })
    }

});


router.post('/', (req, res) => {

    try {
        
        //console.log(req.body);
        const id = getMaxId();
        //console.log(id);
        const product = new Product(req.body.title, req.body.price, req.body.thumbnail, id + 1);
        //console.log(product);
        products.push(product);
        return res.json( product )
    } catch (error) {
        return res.json({error});
    }
});

router.put('/:id', (req, res) => {
    
    try {
        const product = products.find( (x) => parseInt(x.id)  === parseInt(req.params.id));        
        product.title = req.body.title;
        product.price = req.body.price;
        product.thumbnail = req.body.thumbnail;
        return res.json(product);
    } catch (error) {
        return res.json({error: "404 producto no encontrado para PUT"});
    }
});

router.delete('/:id', (req, res) => {
    try {
        const product = products.find( (x) => parseInt(x.id) === parseInt(req.params.id));
        //console.log(producto);
        if( product ){
            products = products.filter( (x) => parseInt(x.id) !== parseInt(producto.id));
          //  console.log(producto);
            return res.json(product);
        } else {
            return res.json({error: "404 producto no encontrado para DELETE"});
        }
    } catch (error) {
        return res.json({error: "404 producto no encontrado para DELETE"});
    }

});


function getMaxId() {
    const ids = products.map((prod) => prod.id);
  
    return ids.length > 0 ? Math.max(...ids) : 0;
  }