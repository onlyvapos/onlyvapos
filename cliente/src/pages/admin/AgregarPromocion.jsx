import React, { useState, useEffect } from "react";
import styles from "./AgregarPromocion.module.css";

const AgregarPromocion = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newPromotions, setNewPromotions] = useState([]);

    useEffect(() => {
        const fetchProductsWithoutPromotions = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/without-promotions`);
                if (!response.ok) {
                    throw new Error("Error fetching products");
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError("Error fetching products");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsWithoutPromotions();
    }, []);

    const openModal = (product) => {
        setCurrentProduct(product);
        setNewPromotions([{ quantity: "", price: "" }]); // Inicialmente una fila vacía
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentProduct(null);
    };

    const handlePromotionChange = (index, field, value) => {
        const updatedPromotions = [...newPromotions];
        updatedPromotions[index][field] = value;
        setNewPromotions(updatedPromotions);
    };

    const addPromotionRow = () => {
        setNewPromotions([...newPromotions, { quantity: "", price: "" }]);
    };

    const removePromotionRow = (index) => {
        setNewPromotions(newPromotions.filter((_, i) => i !== index));
    };

    const savePromotions = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${currentProduct._id}/update-promotions`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ promotions: newPromotions }),
            });

            if (!response.ok) throw new Error("Error adding promotions");

            // Actualizar la lista de productos después de agregar promociones
            const updatedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/products/without-promotions`);
            const updatedProducts = await updatedResponse.json();
            setProducts(updatedProducts);

            closeModal();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
            <h1>Productos sin promociones</h1>
            <div className={styles.productList}>
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id} className={styles.productItem}>
                            <div className={styles.productImageContainer}>
                                <img
                                    src={product.srcImage.length > 0 ? `${product.srcImage[0]}` : "/assets/images/default.png"}
                                    alt={product.brand}
                                    className={styles.productImage}
                                />
                            </div>
                            <div className={styles.productInfo}>
                                <h3>{product.brand} - {product.modelo}</h3>
                                <h3>Capacidad: {product.capacity} </h3>
                                <p><strong>Precio normal:</strong> ${product.price}</p>
                            </div>
                            <button className={styles.addPromoBtn} onClick={() => openModal(product)}>
                                Agregar Promoción
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No hay productos disponibles para promociones.</p>
                )}
            </div>

            {/* Modal para agregar promociones */}
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Agregar Promociones a {currentProduct.brand} - {currentProduct.modelo}</h2>
                        <h3>{currentProduct.capacity} Hits - Precio normal: ${currentProduct.price}</h3>
                        <table className={styles.promotionTable}>
                            <thead>
                                <tr>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newPromotions.map((promo, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="number"
                                                value={promo.quantity}
                                                onChange={(e) => handlePromotionChange(index, "quantity", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={promo.price}
                                                onChange={(e) => handlePromotionChange(index, "price", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button className={styles.deleteBtn} onClick={() => removePromotionRow(index)}>X</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className={styles.addBtn} onClick={addPromotionRow}>+ Agregar Promoción</button>
                        <div className={styles.modalActions}>
                            <button className={styles.confirmBtn} onClick={savePromotions}>Guardar</button>
                            <button className={styles.cancelBtn} onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgregarPromocion;
