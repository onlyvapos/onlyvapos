import React, { useEffect, useState } from "react";
import { MdEdit, MdDelete, MdAddCircle } from "react-icons/md";
import styles from "./AdminPromotions.module.css";
import { useNavigate } from "react-router-dom";


const AdminPromociones = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newPromotions, setNewPromotions] = useState([]);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/with-promotions`);
                if (!response.ok) {
                    throw new Error("Error fetching promotions");
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPromotions();
    }, []);

    // Abrir el modal para editar promociones
    const openModal = (product) => {
        setCurrentProduct(product);
        setNewPromotions([...product.promotions]); // Copiar promociones actuales
        setIsModalOpen(true);
    };

    // Cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentProduct(null);
    };

    // Abrir el modal de confirmación de eliminación
    const openDeleteModal = (product) => {
        setCurrentProduct(product);
        setIsDeleteModalOpen(true);
    };

    // Cerrar el modal de eliminación
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCurrentProduct(null);
    };

    // Manejar cambios en los inputs de promoción
    const handlePromotionChange = (index, field, value) => {
        const updatedPromotions = [...newPromotions];
        updatedPromotions[index][field] = value;
        setNewPromotions(updatedPromotions);
    };

    // Agregar una nueva promoción
    const addPromotion = () => {
        setNewPromotions([...newPromotions, { quantity: "", price: "" }]);
    };

    // Eliminar una promoción específica
    const removePromotion = (index) => {
        setNewPromotions(newPromotions.filter((_, i) => i !== index));
    };

    const handleClearPromotions = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${currentProduct._id}/clear-promotions`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error clearing promotions");
            }

            // Actualizar la lista de productos después de eliminar promociones
            const updatedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/products/with-promotions`);
            const updatedProducts = await updatedResponse.json();
            setProducts(updatedProducts);
            closeDeleteModal();
        } catch (err) {
            console.error("Error while clearing promotions:", err);
        }
    };
    

    // Guardar cambios en el backend
    const savePromotions = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${currentProduct._id}/update-promotions`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ promotions: newPromotions }),
            });

            if (!response.ok) throw new Error("Error updating promotions");

            // Actualizar la lista de productos con las nuevas promociones
            const updatedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/products/with-promotions`);
            const updatedProducts = await updatedResponse.json();
            setProducts(updatedProducts);

            closeModal();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Promociones Actuales</h1>
            <button className={styles.addPromoPageBtn} onClick={() => navigate("/admin/promociones/agregar")}>
                <MdAddCircle size={40} />
            </button>
            <div className={styles.productList}>
                {products.map((product) => (
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
                            <p><strong>Precio normal:</strong> ${product.price}</p>
                            <p><strong>Promociones:</strong></p>
                            {product.promotions.length > 0 ? (
                                <ul>
                                    {product.promotions.map((promo, index) => (
                                        <li key={index}>{promo.quantity} unidades → ${promo.price} cada uno</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Sin promociones</p>
                            )}
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.editBtn} onClick={() => openModal(product)}>
                                <MdEdit size={20} />
                            </button>
                            <button className={styles.deleteBtn} onClick={() => openDeleteModal(product)}>
                                <MdDelete size={20} />
                            </button>

                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Editar Promociones de {currentProduct.brand} - {currentProduct.modelo}</h2>
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
                                            <button className={styles.deleteBtn} onClick={() => removePromotion(index)}>X</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className={styles.addBtn} onClick={addPromotion}>+ Agregar Promoción</button>
                        <div className={styles.modalActions}>
                            <button className={styles.confirmBtn} onClick={savePromotions}>Guardar</button>
                            <button className={styles.cancelBtn} onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación para eliminar promociones */}
            {isDeleteModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Eliminar todas las promociones</h2>
                        <p>¿Estás seguro de que deseas eliminar todas las promociones de <strong>{currentProduct?.brand} - {currentProduct?.modelo}</strong>?</p>
                        <div className={styles.modalActions}>
                            <button className={styles.confirmBtn} onClick={handleClearPromotions}>Sí, eliminar</button>
                            <button className={styles.cancelBtn} onClick={closeDeleteModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminPromociones;
