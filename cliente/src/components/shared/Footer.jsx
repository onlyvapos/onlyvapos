import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css'; 

const Footer = () => {
  const [links, setLinks] = useState({
    main: '',
    backup: '',
    number: ''
  });

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/links/get`);
        const data = await res.json();

        const mappedLinks = {
          main: data.find(link => link.link === 'main')?.value || '',
          backup: data.find(link => link.link === 'backup')?.value || '',
          number: data.find(link => link.link === 'number')?.value || ''
        };

        setLinks(mappedLinks);
      } catch (error) {
        console.error('Error al obtener enlaces del footer:', error);
      }
    };

    fetchLinks();
  }, []);

  const whatsappMessage = 'Hola, quiero más información.';
  const whatsappLink = `https://wa.me/52${links.number}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>

        <div className={styles['footer-column']}>
          <h4>🏢 Empresa</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/about">Sobre Nosotros</Link></li>
          </ul>
        </div>

        <div className={styles['footer-column']}>
          <h4>🛒 Tienda</h4>
          <ul>
            <li><Link to="/category">Todos los productos</Link></li>
            <li><Link to="/featured">Destacados</Link></li>
            <li><Link to="/promotions">Promociones</Link></li>
          </ul>
        </div>

        <div className={styles['footer-column']}>
          <h4>📞 Contáctanos</h4>
          <ul>
            <li><a href={links.main} target="_blank" rel="noreferrer">Instagram Principal</a></li>
            <li><a href={links.backup} target="_blank" rel="noreferrer">Instagram Respaldo</a></li>
            <li><a href={whatsappLink} target="_blank" rel="noreferrer">WhatsApp</a></li>
          </ul>
        </div>

        <div className={styles['footer-column']}>
  <div className={styles['logo-row']}>
      <img
        src="/assets/images/logos/logo-gris.png"
        alt="OnlyVapes logo"
        className={styles['footer-logo']}
      />
      <img
        src="/assets/images/logos/main-poto.png"
        alt="OnlyVapes logo"
        className={styles['footer-logo']}
      />
      <img
        src="/assets/images/logos/secun-poto.png"
        alt="OnlyVapes logo"
        className={styles['footer-logo']}
      />
    </div>
  </div>

      </div>

      <div className={styles['footer-bottom']}>
        <p>&copy; 2025 OnlyVapes</p>
      </div>
    </footer>
  );
};

export default Footer;
