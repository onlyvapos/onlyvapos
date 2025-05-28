import React, { useEffect, useState } from 'react';
import styles from './AdminCarousel.module.css';

const AdminCarousel = () => {
  const [type, setType] = useState('main');
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
        try {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/carousel/${type}`);
          const data = await res.json();
          setImages(data.images || []);
        } catch (err) {
          console.error('Error fetching carousel images:', err);
        }
      };
    fetchImages();
  }, [type]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/carousel/upload/${type}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setImages(data.data.images);
      setSelectedFile(null);
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  const handleDelete = async (imageUrl) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/carousel/remove/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });
      const data = await res.json();
      setImages(data.data.images);
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Administrar Carrusel</h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="main">Carrusel Principal</option>
        <option value="secondary">Carrusel Secundario</option>
      </select>

      <div className={styles.uploadSection}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload}>Subir Imagen</button>
      </div>

      <div className={styles.imageList}>
        {images.map((url, index) => (
          <div key={index} className={styles.imageItem}>
            <img src={`${url}`} alt={`img-${index}`} className={styles.carouselImg} />
            <button onClick={() => handleDelete(url)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCarousel;
