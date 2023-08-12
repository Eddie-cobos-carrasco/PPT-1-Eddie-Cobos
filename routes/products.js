const express = require('express');
const router = express.Router();
const fs = require('fs');

const PRODUCTS_FILE = 'productos.json';

router.get('/', (req, res) => {
  const limit = req.query.limit || 10;

  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    res.json(products.slice(0, limit));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:pid', (req, res) => {
  const pid = req.params.pid;

  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    const product = products.find(product => product.id === pid);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', (req, res) => {
  const newProduct = req.body;

  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    products.push(newProduct);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:pid', (req, res) => {
  const pid = req.params.pid;
  const updatedProduct = req.body;

  try {
    let products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    const index = products.findIndex(product => product.id === pid);

    if (index === -1) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      products[index] = { ...products[index], ...updatedProduct };
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
      res.json(products[index]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:pid', (req, res) => {
  const pid = req.params.pid;

  try {
    let products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    const index = products.findIndex(product => product.id === pid);

    if (index === -1) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      const deletedProduct = products.splice(index, 1)[0];
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
      res.json(deletedProduct);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;