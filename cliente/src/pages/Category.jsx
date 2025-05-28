import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Category.module.css';

const Category = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/get`);
                if (!response.ok) {
                    throw new Error('Error al obtener productos');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError('Error al obtener los productos');
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
            <h1>Catálogo de productos</h1>
            <div className={styles.productList}>
                {products && products.length > 0 ? (
                    products.map((product, index) => (                      
                        <Link to={`/product/${product._id}`} className={styles.productCard}>
                            <img
                                src={product.srcImage && product.srcImage.length > 0
                                ? `${product.srcImage[0]}`
                                : "/assets/images/default.png"}
                                alt={product.modelo}
                                className={styles['product-image']}
                                onError={(e) => e.target.src = "/assets/images/default.png"}
                                />
                            <h3>{product.brand} {product.modelo} {product.capacity}</h3>
                            <p>MX ${product.price}</p>
                        </Link>
                    ))
                ) : (
                    <p>No se encontraron productos.</p>
                )}
            </div>
        </div>
    );
};

export default Category;
