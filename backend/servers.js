const express = require('express');
const cors = require('cors');
const axios = require('axios');
const productsData = require('./products.json');

const app = express();
const PORT = 5000;
const API_KEY = 'goldapi-e8ecsm8cfzxls-io';

app.use(cors());

// Getting gold prices from online source.

async function getGoldPrice() {
  try {
    const response = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      params: {
        access_key: API_KEY,
        base: 'USD',
        symbols: 'XAU',
      },
    });

    const pricePerOunce = response.data.rates.XAU;
    return pricePerOunce / 31.1035;
  } catch (error) {
    console.error('Error fetching gold price:', error);
    return 60; 
  }
}

// Function for calculating the price of the product based on the given formula from assignment.

function calculatePrice(popularityScore, weight, goldPrice) {
  return ((popularityScore + 1) * weight * goldPrice).toFixed(2);
}

// Getting the products from the JSON file and calculating the price and popularity score.

app.get('/api/products', async (req, res) => {
  const goldPrice = await getGoldPrice();
  let { minPrice, maxPrice, minPopularity, maxPopularity } = req.query;

  let products = productsData.map(product => ({
    ...product,
    price: calculatePrice(product.popularityScore, product.weight, goldPrice),
    popularityScore: (product.popularityScore * 5).toFixed(1),
  }));

  if (minPrice || maxPrice) {
    products = products.filter(p => (!minPrice || p.price >= minPrice) && (!maxPrice || p.price <= maxPrice));
  }

  if (minPopularity || maxPopularity) {
    products = products.filter(p => (!minPopularity || p.popularityScore >= minPopularity) && (!maxPopularity || p.popularityScore <= maxPopularity));
  }

  res.json(products);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
