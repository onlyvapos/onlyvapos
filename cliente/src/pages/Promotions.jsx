import React, { useEffect, useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Promotions.module.css';

const Promotions = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/promotion`);
        if (!response.ok) throw new Error('Error al obtener productos en promoción');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Error al obtener los productos en promoción');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.categoryContainer}>
      <button className={styles.goBackButton} onClick={() => navigate(-1)}>
        <AiOutlineArrowLeft size={24} /> Volver
      </button>
      <h1>Productos en promoción</h1>
      <p>Productos en promociones por pieza, échales un vistazo</p>
      <div className={styles.productList}>
        {products.length > 0 ? (
          products.map((product, index) => (
            <Link to={`/product/${product._id}`} className={styles.productCard} key={index}>
              <img
                src={product.srcImage?.[0] || "/assets/images/default.png"}
                alt={product.modelo}
                onError={(e) => e.currentTarget.src = "/assets/images/default.png"}
                className={styles['product-image']}
              />
              <h3>{product.brand} {product.modelo} {product.capacity}</h3>
              <p>MX ${product.price}</p>
            </Link>
          ))
        ) : (
          <p>No se encontraron productos en promoción.</p>
        )}
      </div>
    </div>
  );
};

export default Promotions;
