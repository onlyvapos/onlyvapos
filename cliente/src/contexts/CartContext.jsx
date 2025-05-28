import React, { createContext, useState, useContext } from 'react';
import { useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
});


    const addToCart = (item) => {
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (cartItem) => cartItem.id === item.id && cartItem.flavor === item.flavor
            );
            if (existingItemIndex >= 0) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += item.quantity;
                return updatedItems;
            } else {
                return [...prevItems, item];
            }
        });
    };


    const incrementItemQuantity = (id, flavor) => {
        setCartItems(prevItems => {
            return prevItems.map(item =>
                item.id === id && item.flavor === flavor
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        });
    };

    const decrementItemQuantity = (id, flavor) => {
        setCartItems(prevItems => {
            return prevItems.map(item =>
                item.id === id && item.flavor === flavor && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
        });
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const removeFromCart = (id, flavor) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== id || item.flavor !== flavor)
        );
    };

    const calculateCartPrices = () => {
        return cartItems.map((item) => {
            let price = item.price;

            if (item.hasPromotion && item.promotions && item.promotions.length > 0) {
                const applicablePromotion = item.promotions
                    .filter(promo => item.quantity >= promo.quantity)
                    .sort((a, b) => b.quantity - a.quantity)[0];

                if (applicablePromotion) {
                    price = applicablePromotion.price;
                }
            }

            return {
                ...item,
                price,
            };
        });
    };

    const cartWithPrices = calculateCartPrices();

    useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}, [cartItems]);

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{
            cartItems: cartWithPrices,
            addToCart,
            removeFromCart,
            clearCart,
            getTotalItems,
            incrementItemQuantity,
            decrementItemQuantity
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
