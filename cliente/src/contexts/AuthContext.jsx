import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = Cookies.get('authToken');
                if (token) {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/validateToken`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ authToken: token }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('Token válido:', data);
                        setIsAuthenticated(true);  // Token válido
                    } else {
                        console.log('Token inválido');
                        Cookies.remove('authToken');
                        setIsAuthenticated(false);  // Token inválido
                    }
                } else {
                    setIsAuthenticated(false);  // No hay token
                }
            } catch (error) {
                console.error('Error al verificar el token:', error);
                setIsAuthenticated(false);  // En caso de error
            } finally {
                setLoading(false);  // Se asegura de que 'loading' se actualice
            }
        };

        verifyToken();
    }, []); // Solo se ejecuta una vez, al montar el componente

    const login = (token) => {
        Cookies.set('authToken', token, { expires: 1, sameSite: 'Strict' });
        setIsAuthenticated(true);
    };

    const logout = () => {
        Cookies.remove('authToken');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
