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
    async loadProducts() {
        try {
          const productsData = await fs.readFile(this.path, 'utf-8');
          this.products = JSON.parse(productsData);
          this.idCounter = Math.max(...this.products.map(product => product.id), 0) + 1;
        } catch (error) {
          this.products = [];
        }
      }
    
      async saveProducts() {
        try {
          await fs.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
        } catch (error) {
          throw new Error(`Error al escribir en el archivo: ${error.message}`);
        }
      }
    
      createId() {
        return this.idCounter++;
      }
    
      validations(product) {
        for (const key in product) {
          if (typeof product[key] === 'undefined') {
            throw new Error(`ERROR: El campo '${key}' no puede estar indefinido`);
          }
        }
        