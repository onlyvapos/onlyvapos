import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useCart } from '../contexts/CartContext';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFlavor, setSelectedFlavor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [finalPrice, setFinalPrice] = useState(0);
    const [basePrice, setBasePrice] = useState(0);
    const [isPromoActive, setIsPromoActive] = useState(false);
    const [flavorError, setFlavorError] = useState('');
    const { addToCart } = useCart();
    const [feedbackMessage, setFeedbackMessage] = useState('');


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/get/${id}`);
                if (!response.ok) {
                    throw new Error('Error al obtener el producto');
                }
                const data = await response.json();
                setProduct(data);
                setBasePrice(data.price);
                setFinalPrice(data.price);
            } catch (err) {
                setError('Error al obtener el producto');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const closeModal = () => {
        setSelectedImage(null);
    };

    const handleQuantityChange = (value) => {
        if (value >= 1) {
            setQuantity(value);
        }
    };

    const calculatePrice = useCallback(() => {
        let price = basePrice;
        let promoActive = false;

        if (product?.promotions?.length > 0) {
            for (let promotion of product.promotions) {
                if (quantity >= promotion.quantity && promotion.price < price) {
                    price = promotion.price;
                    promoActive = true;
                }
            }
        }

        setFinalPrice(price);
        setIsPromoActive(promoActive);
    }, [basePrice, product, quantity]);

    useEffect(() => {
        if (product) {
            calculatePrice();
        }
    }, [quantity, product, calculatePrice]);

    const handleFlavorClick = (flavor) => {
        setSelectedFlavor((prevFlavor) => (prevFlavor === flavor ? null : flavor));
        setFlavorError('');
    };

    const handleAddToCart = () => {
        if (product?.flavors?.length > 0 && !selectedFlavor) {
            setFlavorError('Por favor, selecciona un sabor.');
            return;
        }

        const productDetails = {
            id: product._id,
            name: `${product.brand} ${product.modelo} ${product.capacity}`,
            flavor: selectedFlavor || null,
            quantity,
            price: finalPrice,
            image: product.srcImage[0],
            hasPromotion: product.hasPromotion,
            promotions: product.promotions,
            basePrecie: product.price,
        };

        console.log('Producto a agregar al carrito:', productDetails);
        addToCart(productDetails);
        setSelectedFlavor(null);
        setQuantity(1);
        setFeedbackMessage('Producto agregado al carrito 🎉');
        setTimeout(() => {
            setFeedbackMessage('');
        }, 3000);
    };

    const goBack = () => {
        navigate(-1);
    };

    if (loading) return <p className={styles.loading}>Cargando...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.productDetailContainer}>
            <button className={styles.goBackButton} onClick={goBack}>
                <AiOutlineArrowLeft size={24} /> Volver
            </button>

            {product && (
                <div className={styles.productDetail}>
                    <div className={styles.imageContainer}>
                        <Swiper navigation modules={[Navigation]} className={styles.swiperContainer}>
                            {product.srcImage && product.srcImage.length > 0 ? (
                                product.srcImage.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={`${img}`}
                                            alt={`${product.modelo} ${index}`}
                                            className={styles.productImage}
                                            onClick={() => setSelectedImage(img)}
                                            onError={(e) => e.target.src = "/assets/images/default.png"}
                                        />
                                    </SwiperSlide>
                                ))
                            ) : (
                                <SwiperSlide>
                                    <img
                                        src="/assets/images/default.png"
                                        alt="Imagen por defecto"
                                        className={styles.productImage}
                                    />
                                </SwiperSlide>
                            )}
                        </Swiper>
                    </div>
                    <div className={styles.productInfo}>
                        <h1>{product.brand} {product.modelo} {product.capacity}</h1>
                        <p className={styles.price}>
                            {isPromoActive ? (
                                <>
                                    <span className={styles.originalPrice}>MX ${basePrice.toFixed(2)}</span>
                                    <strong>MX ${finalPrice.toFixed(2)}</strong>
                                </>
                            ) : (
                                <strong>MX ${basePrice.toFixed(2)}</strong>
                            )}
                        </p>
                        <p className={styles.description}>{product.description}</p>

                        {product.flavors?.length > 0 && (
                            <>
                                <div className={styles.quantityContainer}>
                                    <span>Sabor:</span>
                                </div>
                                <div className={styles.flavorsContainer}>
                                    {product.flavors.map((flavor, index) => (
                                        <button
                                            key={index}
                                            className={styles.flavorButton}
                                            onClick={() => handleFlavorClick(flavor)}
                                            style={{
                                                background: selectedFlavor === flavor ? '#00517D' : '#00AEF2'
                                            }}
                                        >
                                            {flavor}
                                        </button>
                                    ))}
                                </div>
                                {flavorError && <p className={styles.flavorError}>{flavorError}</p>}
                            </>
                        )}

                        <div className={styles.quantityContainer}>
                            <span>Cantidad:</span>
                            <div className={styles.quantitySelector}>
                                <button
                                    className={styles.quantityButton}
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    className={styles.quantityInput}
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                    min="1"
                                />
                                <button
                                    className={styles.quantityButton}
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {product.promotions?.length > 0 && (
                            <div className={styles.promotionsContainer}>
                                <h3>Promociones disponibles:</h3>
                                <ul>
                                    {product.promotions.map((promotion, index) => (
                                        <li key={index}>
                                            <strong>{promotion.quantity} productos</strong> - Precio: MX ${promotion.price}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <br />
                        <button className={styles.addToCartButton} onClick={handleAddToCart}>
                            Agregar al carrito
                        </button>
                        {feedbackMessage && (
                        <div className={styles.toast}>
                            <span>✔</span> {feedbackMessage}
                        </div>
                        )}
                    </div>
                </div>
            )}

            {selectedImage && (
                <div className={styles.modal}>
                    <button className={styles.closeButton} onClick={closeModal}>✖</button>
                    <div className={styles.modalContent}>
                        <img src={`${selectedImage}`} alt="Producto ampliado" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
