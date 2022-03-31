class Producto {
    constructor (title, price, thumbnail, id){
        this.title = title;
        this.price = parseFloat(price);
        this.thumbnail = thumbnail;
        this.id = parseInt(id);

    }
}

export default Producto;