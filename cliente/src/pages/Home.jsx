import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [promotionsProducts, setPromotionsProducts] = useState([]);
  const [mainCarouselImages, setMainCarouselImages] = useState([]);
  const [secondaryCarouselImages, setSecondaryCarouselImages] = useState([]);

  // Configuración del primer carrusel
  const settings1 = {
    dots: true,
    infinite: mainCarouselImages.length > 1, 
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Configuración del segundo carrusel
  const settings2 = {
    dots: false,
    infinite: secondaryCarouselImages.length > 1,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 2000,
    slidesToShow: 2.93, 
    slidesToScroll: 1,
    centerMode: true, 
    centerPadding: "10%", 
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.93,
          centerPadding: "1%",
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.225,
          centerPadding: "0px",
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.625,
          centerPadding: "0px", // En móvil, solo se muestra una imagen
        }
      }
    ]
  };


  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/latest`);
        if (!response.ok) {
          throw new Error('Error al obtener productos');
        }
        const data = await response.json();
        setLatestProducts(data);
      } catch (err) {
        setError('Error al obtener los productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/featured`);
        if (!response.ok) {
          throw new Error('Error al obtener los productos destacados');
        }
        const data = await response.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Error al obtener los productos destacados:', error);
      }
    };

    const fetchPromotionsProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/promotion`);
        if (!response.ok) {
          throw new Error('Error al obtener los productos con promociones');
        }
        const data = await response.json();
        setPromotionsProducts(data);
      } catch (error) {
        console.error('Error al obtener los productos con promociones:', error);
      }
    };

    const fetchCarouselImages = async () => {
      try {
        const [mainRes, secondaryRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/carousel/main`),
          fetch(`${process.env.REACT_APP_API_URL}/api/carousel/secondary`)
        ]);
    
        if (!mainRes.ok || !secondaryRes.ok) {
          throw new Error('Error al obtener las imágenes del carrusel');
        }
    
        const mainData = await mainRes.json();
        const secondaryData = await secondaryRes.json();
    
        setMainCarouselImages(mainData.images || []);
        setSecondaryCarouselImages(secondaryData.images || []);
      } catch (err) {
        console.error('Error al obtener las imágenes del carrusel:', err);
      }
    };
    
    fetchCarouselImages();
    fetchLatestProducts();
    fetchFeaturedProducts();
    fetchPromotionsProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Primer carrusel */}
      <div className={styles['carousel-container']}>
        <Slider {...settings1}>
          {mainCarouselImages.map((imgUrl, index) => (
            <div key={index}>
              <img
                src={`${imgUrl}`}
                alt={`Carrusel Main ${index + 1}`}
                className={styles['carousel-image']}
                onError={(e) => e.currentTarget.src = "/assets/images/default.png"}
              />
            </div>
          ))}
        </Slider>
        <br /><br />
      </div>

      {/* Segundo carrusel */}
      <div className={styles['second-carousel-container']}>
        <Slider {...settings2} className={styles['second-carousel-slider']}>
          {secondaryCarouselImages.map((imgUrl, index) => (
            <div key={index}>
              <img
                src={`${imgUrl}`}
                alt={`Carrusel Secondary ${index + 1}`}
                className={styles['carousel-image2']}
                onError={(e) => e.currentTarget.src = "/assets/images/default.png"}
              />
            </div>
          ))}
        </Slider>
      </div>


      {/* Sección 'Lo nuevo' */}
      <div className={styles['contenido']}>
        <p>Lo nuevo</p>
        <Link to="/category">Ver todos los productos</Link>
        <div className={styles['latest-products-container']}>
          {latestProducts.map((product, index) => (
            <Link to={`/product/${product._id}`} className={styles['product-card']} key={index}>
              <img
                src={product.srcImage && product.srcImage.length > 0
                  ? `${product.srcImage[0]}`
                  : "/assets/images/default.png"} // Usa la imagen por defecto si no hay imagen
                alt={product.modelo}
                className={styles['product-image']}
                onError={(e) => e.target.src = "/assets/images/default.png"} // Si hay un error al cargar, usa la imagen por defecto
              />
              <h3>{product.brand} {product.modelo} {product.capacity}</h3>
              <p>MX ${product.price}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Sección 'Destacado' */}
      <div className={styles['contenido']}>
        <p>
          Destacado <span className={styles['fire-icon']}>🔥</span>
        </p>
        <Link to="/featured">Ver todos los destacados</Link>
        <div className={styles['latest-products-container']}>
          {featuredProducts.map((product, index) => (
            <Link to={`/product/${product._id}`} className={styles['product-card']} key={index}>
              <img
                src={product.srcImage && product.srcImage.length > 0
                  ? `${product.srcImage[0]}`
                  : "/assets/images/default.png"} // Usa imagen por defecto si no hay imagen
                alt={product.modelo}
                className={styles['product-image']}
                onError={(e) => e.target.src = "/assets/images/default.png"}
              />
              <h3>{product.brand} {product.modelo} {product.capacity}</h3>
              <p>MX ${product.price}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Sección 'Promociones' */}
      <div className={styles['contenido']}>
        <p>
          Promociones <span className={styles['fire-icon']}>🎉</span>
        </p>
        <Link to="/promotions">Ver todas las promociones</Link>
        <div className={styles['latest-products-container']}>
        {promotionsProducts.map((product, index) => (
          <Link to={`/product/${product._id}`} className={styles['product-card']} key={index}>
            <div className={styles['imageWrapper']}>
              <img
                src={product.srcImage?.[0] || "/assets/images/default.png"}
                alt={product.modelo}
                className={styles['product-image']}
                onError={(e) => e.target.src = "/assets/images/default.png"}
              />
              <div className={styles['offerBadge']}>
                <img src="/assets/images/logos/oferta.png" alt="Oferta especial" />
              </div>
            </div>
            <h3>{product.brand} {product.modelo} {product.capacity}</h3>
            <p>MX ${product.price}</p>
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
