const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 3000; // Puerto en el que se ejecutará el servidor

const productManager = new ProductManager('./servicios.json');

app.use(express.json());

// Endpoint para obtener todos los productos o un número limitado de productos
app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit); // Obtén el límite de resultados del query param
    const products = await productManager.getProducts();
    
    // Si se proporciona un límite, devuelve solo la cantidad especificada de productos
    if (!isNaN(limit) && limit > 0) {
      const limitedProducts = products.slice(0, limit);
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener un producto específico por ID
app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    if (!isNaN(productId)) {
      const product = await productManager.getProductsById(productId);
      res.json(product);
    } else {
      res.status(400).json({ error: 'El ID del producto no es válido.' });
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${port}`);
});