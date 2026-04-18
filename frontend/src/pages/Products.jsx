import { useEffect, useState } from 'react';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Products</h1>

      {products.map(product => (
        <div key={product.product_id}>
          <h3>{product.name}</h3>
          <p>₹{product.price}</p>

          {product.images?.length > 0 && (
            <img src={product.images[0]} width="150" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Products;