const express = require('express');
const router = express.Router();
const fs = require('fs');

const CARTS_FILE = 'carrito.json';
const PRODUCTS_FILE = 'productos.json';

function readCartsFile() {
  return JSON.parse(fs.readFileSync(CARTS_FILE, 'utf8'));
}

function writeCartsFile(carts) {
  fs.writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2));
}

router.get('/', (req, res) => {
  const carts = readCartsFile();
  res.json(carts);
});

router.get('/:cid', (req, res) => {
  const cid = req.params.cid;
  const carts = readCartsFile();
  const cart = carts.find(cart => cart.id === cid);

  if (!cart) {
    res.status(404).json({ message: 'Cart not found' });
  } else {
    res.json(cart);
  }
});

router.post('/', (req, res) => {
  const newCart = {
    id: Date.now().toString(),
    products: []
  };
  const carts = readCartsFile();
  carts.push(newCart);
  writeCartsFile(carts);
  res.json(newCart);
});

router.put('/:cid/products/:pid/:units', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const units = parseInt(req.params.units);

  const carts = readCartsFile();
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  const cart = carts.find(cart => cart.id === cid);
  const product = products.find(product => product.id === pid);

  if (!cart || !product) {
    res.status(404).json({ message: 'Cart or product not found' });
    return;
  }

  if (product.stock < units) {
    res.status(400).json({ message: 'Not enough stock' });
    return;
  }

  cart.products.push({ id: pid, units });
  product.stock -= units;
  writeCartsFile(carts);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

  res.json(cart);
});

router.delete('/:cid/products/:pid/:units', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const units = parseInt(req.params.units);

  const carts = readCartsFile();
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  const cart = carts.find(cart => cart.id === cid);
  const product = products.find(product => product.id === pid);

  if (!cart || !product) {
    res.status(404).json({ message: 'Cart or product not found' });
    return;
  }

  const cartProduct = cart.products.find(cp => cp.id === pid);
  if (!cartProduct) {
    res.status(404).json({ message: 'Product not found in cart' });
    return;
  }

  if (cartProduct.units < units) {
    res.status(400).json({ message: 'Not enough units in cart' });
    return;
  }

  cartProduct.units -= units;
  product.stock += units;
  if (cartProduct.units === 0) {
    cart.products = cart.products.filter(cp => cp.id !== pid);
  }
  writeCartsFile(carts);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

  res.json(cart);
});

module.exports = router;