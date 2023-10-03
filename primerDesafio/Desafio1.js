/*Autor: Jimmy Leandro Caderon Rubio
Clase: Backend - CoderHouse
Descripcion: Clase que se utiliza para gestionar una lista de productos, la cual tiene métodos para agregar productos, obtener
productos por ID y realizar algunas validaciones*/

//Definicion de la clase
class ProductManager {
    constructor() {
        this.products = []
        this.idCounter = 1;
    }

    //Método para generar un ID unico por producto
    createId() {
        return this.idCounter++;
    }

    //Método para validar un producto antes de agregarlo
    validations(product) {
        for (const key in product) {
            //Verificar si alguna propiedad no esta definida
            if (typeof product[key] === 'undefined') {
                throw new Error(`ERROR: El campo '${key}' no puede estar indefinido`);
            }
        }

        //Verificar si el código ya existe en la lista de productos
        const checkCode = this.products.find(p => p.code === product.code);
        if (checkCode) {
            throw new Error("ERROR: El código ya está en uso");
        }
    }

    //Método para obtener un producto por su ID
    getProductsById(id) {
        //Busca un producto por su ID en la lista de productos
        const productById = this.products.find(p => p.id === id);
        if (productById) {
            return productById;
        } else {
            throw new Error("Product not found");
        }
    }

    //Método para obtener la lista de productos
    getProducts() {
        return this.products;
    }

    //Método para agregar un producto a la lista de productos
    addProduct(title, description, price, thumbnail, code, stock) {

        const id = this.createId();//Generar el ID unico del producto

        const product = {
            id: id,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        };

        //Realizar las validaciones en el producto
        this.validations(product);

        //Agregar el producto a la lista de productos
        this.products.push(product);
    }
}

//  Testing de Entregable 

const jimmy = new ProductManager();

//Agregar producto de prueba
jimmy.getProducts();
jimmy.addProduct("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc123", 25);
jimmy.getProducts();
console.log("\n");

//Prueba: Generar un producto con el mismo código
try {
    jimmy.addProduct("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc123", 25);
} catch (error) {
    console.error(error.message);
}
console.log("\n");

//Prueba: Obtener un producto por su ID
try {
    const product1 = jimmy.getProductsById(1);
    console.log(product1);
} catch (error) {
    console.error(error.message);
}

//pRUEBA: Intentar obtener un producto con un ID que no existe.
try {
    jimmy.getProductsById(3);
} catch (error) {
    console.error(error.message);
}