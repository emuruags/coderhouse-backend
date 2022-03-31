import express from 'express';
import Producto from './classes/producto.js';


const { Router } = express; 


const app = express();

const router = Router();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/productos', router);


app.use(express.static('public'));

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
})

server.on('error',error => console.log(`Error en el servidor ${error}`))


let productos = [];

// app.get('/', (req, res) => {
//     res.send({ mensaje: 'Hola Mundo'})
// });

router.get('/', (req, res) => {
    //res.send('get ok')
    try {
        res.json(productos);
    } catch (error) {
        res.json({error: '204 no conctent'});
    }
 })

router.get('/:id', (req,res) => {
    //console.log(productos);
    const product = productos.find( (x) => parseInt( x.id) === parseInt(req.params.id));       
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
        const product = new Producto(req.body.title, req.body.price, req.body.thumbnail, id + 1);
        //console.log(product);
        productos.push(product);
        return res.json( product )
    } catch (error) {
        return res.json({error});
    }
});

router.put('/:id', (req, res) => {
    
    try {
        const producto = productos.find( (x) => parseInt(x.id)  === parseInt(req.params.id));        
        producto.title = req.body.title;
        producto.price = req.body.price;
        producto.thumbnail = req.body.thumbnail;
        return res.json(producto);
    } catch (error) {
        return res.json({error: "404 producto no encontrado para PUT"});
    }
});

router.delete('/:id', (req, res) => {
    try {
        const producto = productos.find( (x) => parseInt(x.id) === parseInt(req.params.id));
        //console.log(producto);
        if( producto ){
            productos = productos.filter( (x) => parseInt(x.id) !== parseInt(producto.id));
          //  console.log(producto);
            return res.json(producto);
        } else {
            return res.json({error: "404 producto no encontrado para DELETE"});
        }
    } catch (error) {
        return res.json({error: "404 producto no encontrado para DELETE"});
    }

});


function getMaxId() {
    const ids = productos.map((prod) => prod.id);
  
    return ids.length > 0 ? Math.max(...ids) : 0;
  }