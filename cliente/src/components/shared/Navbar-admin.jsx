import React, { useState, lazy, Suspense } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LuMenu } from "react-icons/lu";
import { IoLogOut } from "react-icons/io5";
import { useAuth } from '../../contexts/AuthContext';
import styles from './NavbarAdmin.module.css';

const ConfirmLogoutDialog = lazy(() => import('./ConfirmLogoutDialog'));

const NAV_ITEMS = [
    { to: "/admin", label: "PRODUCTOS" },
    { to: "/admin/promociones", label: "PROMOCIONES" },
    { to: "/admin/redes", label: "REDES" },
    { to: "/admin/carrusel", label: "CARRUSEL" }
];

function NavbarAdmin() {
    const { isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const closeMenu = () => setIsMenuOpen(false);

    const openLogoutDialog = () => setLogoutDialogOpen(true);
    const closeLogoutDialog = () => setLogoutDialogOpen(false);
    const confirmLogout = () => {
        logout();
        closeLogoutDialog();
        navigate('/login');
    };

    return (
        <nav className={styles.navbarAdmin}>
            <div className={styles.navbarContainer}>
                <button 
                    className={styles.cartBtn} 
                    onClick={toggleMenu} 
                    aria-expanded={isMenuOpen} 
                    aria-label="Toggle Menu"
                >
                    <LuMenu className={styles.icon} />
                </button>

                <NavLink to="/admin" className={styles.navbarLogo}>
                    <img
                        src="/assets/images/banners/navbar2.jpg"
                        alt="Onlyvapes Logo"
                        className={styles.logoImage}
                    />
                </NavLink>

                {isAuthenticated && (
                    <button 
                        className={styles.cartBtn} 
                        onClick={openLogoutDialog} 
                        aria-label="Logout"
                    >
                        <IoLogOut className={styles.icon} />
                    </button>
                )}
            </div>

            <div className={`${styles.menu} ${isMenuOpen ? styles.open : ''}`}>
                <ul>
                    {NAV_ITEMS.map((item) => (
                        <li key={item.to}>
                            <NavLink 
                                to={item.to}
                                className={({ isActive }) => (isActive ? styles.active : '')}
                                onClick={closeMenu}
                                onKeyDown={(e) => e.key === 'Enter' && closeMenu()}
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <button 
                    className={styles.cancelBtn} 
                    onClick={closeMenu}
                    aria-label="Close Menu"
                >
                    Cancelar 
                    <img 
                        src="/assets/images/logos/logo-gris.png" 
                        alt="Cancelar" 
                        className={styles.iconLogo}
                    />
                </button>
            </div>

            <Suspense fallback={<div>Cargando...</div>}>
                <ConfirmLogoutDialog 
                    open={logoutDialogOpen} 
                    onClose={closeLogoutDialog} 
                    onConfirm={confirmLogout} 
                />
            </Suspense>
        </nav>
    );
}

export default NavbarAdmin;
