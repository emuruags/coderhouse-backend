const fs = require('fs');



class Contenedor {

    constructor (fileName) {
        this.fileName = fileName;
    }

    async save(object){
        let array = [];
          
            //validar si existe y agregar datos al archivo

            try {
                const fileExist = fs.existsSync ( this.fileName );
                
                if (fileExist) {
                    // lercuta del archivo
                    const fileData = await fs.promises.readFile( this.fileName, 'utf-8');

                    //console.log(fileData);

                    array = JSON.parse(fileData);

                    const max = array.length
                    //console.log(max);
                    object.id = max + 1;

                    array.push(object);
                    
                    const varContenido = JSON.stringify(array);

                    await fs.promises.writeFile(this.fileName, varContenido);

                    return object.id;

                    

                } else {
                    
                    // No existe archivo

                    object.id = 1;

                    array.push(object);
                    const varContenido = JSON.stringify(array);
                    await fs.promises.writeFile (this.fileName, varContenido);

                    return 1;

                }

            } catch (error) {
                console.log(error);
            }
            
            

            
    }


    async getById(Number){
        try{
            const fileData = await fs.promises.readFile(this.fileName,'utf-8');

            if (fileData) {
                const arrayData = JSON.parse(fileData);
                const producto = arrayData.find( (x) => parseInt(x.id) === parseInt(Number));
                
                if (producto) {
                    console.log(producto);
                    return producto;
                }
            } else {
                return null;
            }
        }catch (error) {
            console.log(error);
        }

    }

    async getAll(){
        try {
            const fileData = await fs.promises.readFile(this.fileName,'utf-8');

            if (fileData) {
                const contenido = JSON.parse(fileData);
                if (contenido) {
                    console.log(contenido);
                    return contenido;
                } else {
                    return [];
                }
            } else {
                return [];
            }

            
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(Number){
        try {
            const fileData = await fs.promises.readFile(this.fileName,'utf-8');
            if ( fileData) {
                const array = JSON.parse(fileData);
                const arrayFiltrado = array.filter((x)=> parseInt(x.id) !== parseInt(Number));
                const contenidoFiltrado = JSON.stringify(arrayFiltrado);

                await fs.promises.writeFile(this.fileName,contenidoFiltrado);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteAll(){
        try {
             await fs.promises.unlink(this.fileName);
        } catch (error) {
            console.log(error);
        }
        

    }

}


const container = new Contenedor('./productos.txt');

module.exports = container;


//console.log(container);

//const producto = { title: "keyboard", price: 10.25, thumbnails: "XXX" };


// container.save(producto).th;

// container.getById(1);

// container.getAll();

// container.deleteById(1);

// container.deleteAll();

// container.save(producto).then((id) => {
//     console.log(id);
//     container.save(producto).then((id) => {
//       console.log(id);
//       container.getById(2).then((data) => {
//         console.log(data);
//         container.getAll().then((data) => {
//           console.log(data);
//           container.deleteById(1).then(() => {
//             container.getAll().then((data) => {
//               console.log(data);
//               container.deleteAll();
//             });
//           });
//         });
//       });
//     });
//   });
  