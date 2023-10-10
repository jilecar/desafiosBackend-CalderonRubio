//importacion de modulo para realizar operaciones de escritura y lectura de archivos
const fs = require('fs').promises

//Declaración de la clase
class ProductManager {
    constructor(filePath) {
      this.path = filePath;
      this.products = [];
      this.idCounter = 1;
      this.loadProducts();
    }

    //Metodos
    //Carga los productos desde el archivo JSON, adicional se calcula el siguiente ID disponible
    async loadProducts() {
        try {
          const productsData = await fs.readFile(this.path, 'utf-8');
          this.products = JSON.parse(productsData);
          this.idCounter = Math.max(...this.products.map(product => product.id), 0) + 1;
        } catch (error) {
          this.products = [];
        }
      }
    
      //Guarda los producots en el archivo JSON
      async saveProducts() {
        try {
          await fs.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
        } catch (error) {
          throw new Error(`Error al guardar en el archivo: ${error.message}`);
        }
      }
    
      //Genera ID unico para cada producto
      createId() {
        return this.idCounter++;
      }
    
      //Validar si un codigo ya existe y validaciones de sus campos
      validations(product) {
        for (const key in product) {
          if (typeof product[key] === 'undefined') {
            throw new Error(`ERROR: El campo '${key}' no puede estar indefinido`);
          }
        }

        //Verificar si el código ya existe en la lista de productos
        const checkCode = this.products.find(p => p.code === product.code);
        if (checkCode) {
          throw new Error('ERROR: El código ya está en uso');
        }
      }

      //obtener un producto por su ID
      getProductsById(id) {
        const productById = this.products.find(p => p.id === id);
        if (productById) {
          return productById;
        } else {
          throw new Error('Producto no encontrado');
        }
      }
    
      //obtener la lista de productos
      async getProducts() {
        return this.products;
      }
    
      //agregar un producto a la lista de productos
      async addProduct(title, description, price, thumbnail, code, stock) {
        const id = this.createId();
    
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

        await this.saveProducts();
      }
    
      //actualiza un producto por su ID y guarda la lista actualizada en el archivo
      async updateProduct(id, updatedProductData) {
        const productToUpdate = this.products.find(product => product.id === id);
    
        if (!productToUpdate) {
          throw new Error('Producto no encontrado');
        } else {
          Object.assign(productToUpdate, updatedProductData);
          await this.saveProducts();
        }
      }
    
      //elimina un producto por su ID y guarda la lista actualizada en el archivo
      async deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
    
        if (productIndex === -1) {
          throw new Error('Producto no encontrado');
        } else {
          this.products.splice(productIndex, 1);
          await this.saveProducts();
        }
      }
    }
    
    //instancia de la clase ProductManager con la ruta donde se almacenaran los productos
    const productManager = new ProductManager('./servicios.json');