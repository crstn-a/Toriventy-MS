// src/pages/ProductsPage.jsx
import { useEffect, useState } from 'react';
import api from '../api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    api.get('/products')
      .then(res => {
        if (!mounted) return;
        setProducts(res.data || []); // <-- expects { data: [...] }
      })
      .catch(err => {
        if (!mounted) return;
        setError(err.message || 'Failed to load products');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error)   return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Products</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.fld_product_id}>
                <td>{p.fld_product_id}</td>
                <td>{p.fld_name}</td>
                <td>{p.fld_price}</td>
                <td>{p.fld_stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}