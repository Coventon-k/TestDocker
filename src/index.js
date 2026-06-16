const express = require('express');
const app = express();

app.use(express.json());

// Middleware logger simple
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Données fictives MyStore
const products = [
  { id: 1, name: 'Coca-Cola 33cl', price: 1.20, stock: 48, category: 'boisson' },
  { id: 2, name: 'Pain de mie', price: 1.80, stock: 12, category: 'alimentaire' },
  { id: 3, name: 'Lait demi-écrémé 1L', price: 0.95, stock: 30, category: 'frais' },
  { id: 4, name: 'Chips nature', price: 2.50, stock: 20, category: 'snack' },
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MyStore API',
    uptime: Math.floor(process.uptime()) + 's',
    env: process.env.NODE_ENV || 'development',
  });
});

app.get('/api/products', (req, res) => {
  const { category } = req.query;
  const result = category
    ? products.filter(p => p.category === category)
    : products;
  res.json({ data: result, total: result.length });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Produit introuvable' });
  res.json({ data: product });
});

app.post('/api/products', (req, res) => {
  const { name, price, stock, category } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'name et price sont requis' });
  }
  const newProduct = { id: products.length + 1, name, price, stock: stock || 0, category };
  products.push(newProduct);
  res.status(201).json({ data: newProduct });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.url} introuvable` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MyStore API démarré sur le port ${PORT}`);
});
