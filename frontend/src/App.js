import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './App.css';

// Setting up app for taking product data from localhost.

function App() {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setProducts(response.data);
        const initialColors = response.data.reduce((acc, product) => {
          acc[product.name] = 'yellow';
          return acc;
        }, {});
        setSelectedColors(initialColors);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleColorChange = (productName, color) => {
    setSelectedColors(prev => ({ ...prev, [productName]: color }));
  };

// Displaying functions for the products with the image slider and color picker.

  return (
    <div className="App">
      <h1>Product List</h1>
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
      >
        {products.map(product => {
          const currentColor = selectedColors[product.name] || 'yellow';
          return (
            <SwiperSlide key={product.name}>
              <div className="product-card">
                <img src={product.images?.[currentColor] || '/fallback.jpg'} alt={product.name} />
                <h3>{product.name}</h3>
                <p>${product.price} USD</p>
                <p>{currentColor.replace(/\b\w/g, c => c.toUpperCase())} Gold</p>
                <p>Popularity: {product.popularityScore}/5</p>
                <div className="color-picker">
                  <button onClick={() => handleColorChange(product.name, 'yellow')} style={{ backgroundColor: '#E6CA97' }}>Yellow</button>
                  <button onClick={() => handleColorChange(product.name, 'white')} style={{ backgroundColor: '#D9D9D9' }}>White</button>
                  <button onClick={() => handleColorChange(product.name, 'rose')} style={{ backgroundColor: '#E1A4A9' }}>Rose</button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default App;