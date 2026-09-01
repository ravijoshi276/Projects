import { useState, useEffect, useContext, createContext, useMemo, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { cartApi, ordersApi } from "../services/api";
import placeholder_image from "../assets/images/menuitem-placeholder.png";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { token, user, isLoggedIn } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    // FIX 1 & 2: Accurate total item count and price calculations
    const itemCount = useMemo(() => {
        return cart.reduce((accumulator, item) => accumulator + item.quantity, 0);    
    }, [cart]);

    const total = useMemo(() => {
        return cart.reduce((sum, item) => Number(sum) + Number(item.price), 0);
    }, [cart]);

    // Getting Cart Details
    useEffect(() => {
        if (!token && !user) {
            setCart([]);
            setLoading(false);
            return;
        }

        const fetchAndStitchCart = async () => {
            setLoading(true);
            try {
                const cartsdata = await cartApi.getCart(token);
                // FIX 4: Safety guard against unexpected backend responses
                if (!cartsdata || !cartsdata.results) {
                    setCart([]);
                    return;
                }
        
                const menuItems = await cartApi.getAllCartItems(cartsdata.results);
               
                const fullCartDetails = cartsdata.results.map((item) => {
                    const matchedItem = menuItems.results?.find(p => p.id === item.menuitem);
                    return {
                        
                        id: item.menuitem,
                        title: matchedItem ? matchedItem.title : "Unknown Product",
                        image_url: matchedItem ? matchedItem.image_url : placeholder_image,
                        quantity: item.quantity,
                        price: matchedItem ? matchedItem.price * item.quantity : 0.0,
                        unit_price: matchedItem ? matchedItem.price : 0.0 
                    };
                });

                setCart(fullCartDetails);
            } catch (err) {
                console.error("Error building stitched cart:", err);
            } finally {
                setLoading(false);
            }
        };

       if (!isLoggedIn) {
        return ;
       } fetchAndStitchCart();
    }, [token, user,isLoggedIn]);
   
    const orderItems = useCallback(async () => {
        setLoading(true);
        try {
            await ordersApi.orderItems(token);
            setCart([]);
        } catch (err) {
            console.error("Failed to process order:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);
    
    // FIX 3: Rewritten to use functional updates to prevent stale state bugs
    const addToCart = useCallback(async (productid, price, title, image = placeholder_image) => {
        let targetQuantity = 1;

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === productid); 
            if (existingItem) {
                targetQuantity = existingItem.quantity + 1;
                return prevCart.map((item) =>
                    item.id === productid 
                        ? { ...item, quantity: targetQuantity, price: price * targetQuantity } 
                        : item
                );
            }
            return [...prevCart, { id: productid, quantity: 1, unit_price: price, title: title, price: price, image_url: image }];
        });
       
        try {
            await cartApi.updateCart(token, { menuitem: productid, unit_price: price, quantity: targetQuantity });
        } catch (err) {
            console.error("Server update failed:", err);
        }
    }, [token]);

    const deleteFromCart = useCallback(async (productid) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productid));
        try {
            await cartApi.updateCart(token, { menuitem: productid, unit_price: 0, quantity: 0 });
        } catch (err) {
            console.error("Failed to delete from cart:", err);
        }
    }, [token]);

    // FIX 3: Rewritten to safely handle quantity drops below zero
    const removeFromCart = useCallback(async (productid, price) => {
        let targetQuantity = 0;

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === productid);
            if (!existingItem) return prevCart;

            targetQuantity = existingItem.quantity - 1;

            if (targetQuantity <= 0) {
                return prevCart.filter((item) => item.id !== productid);
            }

            return prevCart.map((item) => 
                item.id === productid 
                    ? { ...item, quantity: targetQuantity, price: price * targetQuantity }
                    : item
            );
        });

        try {
            await cartApi.updateCart(token, { menuitem: productid, unit_price: price, quantity: targetQuantity });
        } catch (err) {
            console.error("Failed to decrement item from cart:", err);
        }
    }, [token]);
    
    const clearCart = useCallback(async () => {
        setCart([]);
        try {
            await cartApi.deleteCart(token);
        } catch (err) {
            console.error("Failed to clear cart:", err);
        }
    }, [token]);

    const value = useMemo(() => ({
        cart,
        itemCount,
        addToCart,
        deleteFromCart,
        clearCart,
        removeFromCart, 
        loading,
        total,
        orderItems
    }), [cart, itemCount, addToCart, deleteFromCart, clearCart, removeFromCart, loading, total, orderItems]);

    return (
        <CartContext.Provider value={value}> 
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
