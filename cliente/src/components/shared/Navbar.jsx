import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PiHandbagFill } from "react-icons/pi";
import { LuMenu } from "react-icons/lu";
import CartSidebar from "../CartSidebar";
import { useCart } from "../../contexts/CartContext";
import styles from './Navbar.module.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [links, setLinks] = useState({
    main: '',
    backup: '',
    number: ''
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cartItems, removeFromCart, getTotalItems } = useCart();
  const whatsappMessage = 'Hola, quiero más información.';

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Función para abrir y cerrar el carrito
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    console.log("se abrio el carrito");
  };

  // Fetch de enlaces
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/links/get`);
        if (!response.ok) {
          throw new Error('Error al obtener los enlaces');
        }
        const data = await response.json();

        const mappedLinks = {
          main: data.find(link => link.link === 'main')?.value || '',
          backup: data.find(link => link.link === 'backup')?.value || '',
          number: data.find(link => link.link === 'number')?.value || ''
        };

        setLinks(mappedLinks);
      } catch (error) {
        console.error('Error al obtener los enlaces:', error);
      }
    };

    fetchLinks();
  }, []);

  const whatsappLink = `https://wa.me/52${links.number}?text=${encodeURIComponent(whatsappMessage)}`;

  const totalQuantity = getTotalItems();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarIcons}>
          <button className={styles.cartBtn} onClick={toggleMenu}>
            <LuMenu className={styles.icon} />
          </button>
        </div>

        <Link to="/" className={styles.navbarLogo}>
          <img
            src="/assets/images/banners/navbar.jpg"
            alt="Onlyvapes Logo"
            className={styles.logoImage}
          />
        </Link>

        <div className={styles.navbarIcons}>
          <button className={styles.cartBtn} onClick={toggleCart}>
            <PiHandbagFill className={styles.icon} />
            {totalQuantity > 0 && <span className={styles.cartCount}>{totalQuantity}</span>}
          </button>
        </div>
      </div>

     <div className={`${styles.menu} ${isMenuOpen ? styles.open : ''}`}>
        <ul className={styles.menuList}>
          <li><Link to="/" onClick={closeMenu}>HOME</Link></li>
          <li><Link to="/category" onClick={closeMenu}>CATÁLOGO</Link></li>
          <li><Link to="/featured" onClick={closeMenu}>DESTACADO 🔥</Link></li>
          <li><Link to="/promotions" onClick={closeMenu}>PROMOCIONES</Link></li>
        </ul>

        <div className={styles.contactSection}>
          <h1>CONTÁCTANOS:</h1>
          <div className={styles.instagramIcon}>
            <a href={links.main} target="_blank" rel="noopener noreferrer">
              <img src="/assets/images/logos/insta.png" alt="Instagram" />
              <p className={styles.mediaText}>Principal</p>
            </a>
            <a href={links.backup} target="_blank" rel="noopener noreferrer">
              <img src="/assets/images/logos/insta.png" alt="Instagram" />
              <p className={styles.mediaText}>Respaldo</p>
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <img src="/assets/images/logos/whats.png" alt="WhatsApp" />
              <p className={styles.mediaText}>WhatsApp</p>
            </a>
          </div>
        </div>

        <button className={styles.cancelBtn} onClick={closeMenu}>Cancelar
          <img src="/assets/images/logos/main-poto.png" alt="Cancelar" className={styles.iconLogo} />
        </button>
      </div>


      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={toggleCart} 
        cartItems={cartItems} 
        removeFromCart={removeFromCart} 
      />
    </nav>
  );
}

export default Navbar;
