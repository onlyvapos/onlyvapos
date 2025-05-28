import React, { useState, useEffect } from 'react';
import styles from './AdminRedes.module.css';

const AdminRedes = () => {
    const [links, setLinks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentEdit, setCurrentEdit] = useState({ id: '', link: '', value: '' });
    const [newValue, setNewValue] = useState('');
    const [error, setError] = useState('');
    const [initialSetup, setInitialSetup] = useState(false);
    const [newLinks, setNewLinks] = useState({
        main: '',
        backup: '',
        number: '',
    });

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/links/get`);
                if (!response.ok) {
                    throw new Error('Error al obtener los enlaces');
                }
                const data = await response.json();
                
                if (data.length === 0) {
                    setInitialSetup(true); // No hay datos, mostrar formulario de inicio
                } else {
                    setLinks(data);
                }
            } catch (err) {
                setError('Hubo un error al cargar las redes.');
            }
        };

        fetchLinks();
    }, []);

    const handleInputChange = (e) => {
        setNewLinks({ ...newLinks, [e.target.name]: e.target.value });
    };

    const saveInitialLinks = async () => {
        try {
            const entries = Object.entries(newLinks).map(([key, value]) => ({
                link: key,
                value,
            }));

            const createRequests = entries.map(entry =>
                fetch(`${process.env.REACT_APP_API_URL}/api/links/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(entry),
                })
            );

            await Promise.all(createRequests);

            const updatedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/links/get`);
            const updatedData = await updatedResponse.json();
            setLinks(updatedData);
            setInitialSetup(false);
        } catch (err) {
            console.error("Error al crear enlaces:", err);
            setError("Hubo un error al guardar los contactos.");
        }
    };

    const openModal = (id, link, value) => {
        setCurrentEdit({ id, link, value });
        setNewValue(value);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentEdit({ id: '', link: '', value: '' });
        setNewValue('');
    };

    const confirmEdit = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/links/update/${currentEdit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: newValue }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el enlace');
            }

            setLinks((prevLinks) =>
                prevLinks.map((link) =>
                    link._id === currentEdit.id ? { ...link, value: newValue } : link
                )
            );

            closeModal();
        } catch (err) {
            setError('Hubo un error al actualizar el enlace.');
        }
    };

    return (
        <div className={styles.adminRedesContainer}>
            <h1>ACTUALIZAR CONTACTOS</h1>

            {error && <p className={styles.errorMessage}>{error}</p>}

            {initialSetup ? (
                <div className={styles.initialSetupContainer}>
                    <h2>Agregar Contactos</h2>
                    <div className={styles.inputGroup}>
                        <label>Cuenta Principal:</label>
                        <input
                            type="text"
                            name="main"
                            value={newLinks.main}
                            onChange={handleInputChange}
                            placeholder="URL de Instagram principal"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Cuenta de Respaldo:</label>
                        <input
                            type="text"
                            name="backup"
                            value={newLinks.backup}
                            onChange={handleInputChange}
                            placeholder="URL de Instagram de respaldo"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Número de Contacto:</label>
                        <input
                            type="text"
                            name="number"
                            value={newLinks.number}
                            onChange={handleInputChange}
                            placeholder="Número de contacto"
                        />
                    </div>
                    <button className={styles.saveButton} onClick={saveInitialLinks}>
                        Guardar
                    </button>
                </div>
            ) : (
                <div className={styles.linksList}>
                    {links.map((link) => (
                        <div key={link._id} className={styles.linkItem}>
                            <p>
                                <strong>
                                    {link.link === 'main' && 'Cuenta Principal:'}
                                    {link.link === 'backup' && 'Cuenta de Respaldo:'}
                                    {link.link === 'number' && 'Número:'}
                                </strong>{' '}
                                {link.value}
                            </p>
                            <button onClick={() => openModal(link._id, link.link, link.value)} className={styles.editButton}>
                                Editar
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {modalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Editar {currentEdit.link === 'main' ? 'Cuenta Principal' : currentEdit.link === 'backup' ? 'Cuenta de Respaldo' : 'Número'}</h2>
                        <input
                            type="text"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            className={styles.inputField}
                        />
                        <div className={styles.modalActions}>
                            <button onClick={closeModal} className={styles.cancelButton}>
                                Cancelar
                            </button>
                            <button onClick={confirmEdit} className={styles.confirmButton}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRedes;
