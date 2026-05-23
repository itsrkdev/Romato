import { createContext, useEffect, useState } from "react";
import axios from "axios"; // 1. Axios import karein

export const storeContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const [food_list, setFoodList] = useState([]); // 2. State banayein (Static import hata dein)
      const [loading, setLoading] = useState(true); //  item load ke liye skelton state 
    const [token, setToken] = useState(localStorage.getItem("token") || ""); // 1. Token state add karein
    const url = "http://localhost:3000"; 
    // const url = "http://10.61.7.14:3000";// 3. Backend URL add karein
    const [categories, setCategories] = useState([]);

    const [userData, setUserData] = useState(null); // Nayi state


    // Global fetch function
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${url}/api/category/list`);
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Jab app load ho, toh categories auto-load ho jayein
    useEffect(() => {
        fetchCategories();
    }, []);



    // User data fetch karne ka function
    const loadUserData = async (token) => { // Bracket mein 'token' hai

        if (userData) return;

        try {
            console.log("Fetching user profile with token:", token);

            // Yahan 'storedToken' ki jagah 'token' likho jo upar bracket mein hai
            const response = await axios.get(url + "/api/user/get-profile", {
                headers: { token }
            });

            console.log("Backend Response:", response.data);

            if (response.data.success) {
                setUserData(response.data.data);
            }
        } catch (error) {
            console.log("Axios Error:", error);
        }
    }


    useEffect(() => {
        async function loadData() {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadUserData(storedToken); // Token milte hi user profile load karo
            }
        }
        loadData();
    }, []);




    // 2. Backend se cart data mangwana
    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        setCartItems(response.data.cartData || {});
    }


    // 2. Updated Add to Cart
    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    // 3. Updated Remove from Cart
    const removeToCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    // 4. useEffect mein refresh logic


    // Token change hone par cart data load karne ke liye alag useEffect
    // StoreContext.jsx mein ise aise likhein:

    useEffect(() => {
        async function loadData() {
            // 1. Pehle food list load karein (Hamesha)
            await fetchFoodList();

            // 2. LocalStorage se token check karein
            const storedToken = localStorage.getItem("token");

            if (storedToken) {
                // Agar token state mein nahi hai tabhi set karein (Loop se bachne ke liye)
                if (!token) {
                    setToken(storedToken);
                }
                // Cart data load karein
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, [token]); // Jab login popup se setToken hoga, tab ye trigger hoga



  // 4. Data fetch karne ke liye function
    const fetchFoodList = async () => {
        try {
            setLoading(true); // Fetch shuru hote hi loading true karo
            // Headers tabhi bhejein jab token maujood ho
            const config = token ? { headers: { token } } : {};
            const response = await axios.get(url + "/api/food/list", config);
            setFoodList(response.data.data);
            setLoading(false);

        } catch (error) {
            console.error("Error fetching food:", error);
            setLoading(false);
        }
    }



    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                // Find method mein check karein ki data load ho chuka hai
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }


    const getSellerSpecificTotal = (sellerId) => {
        let totalAmount = 0;

        // Agar sellerId nahi hai toh seedha 0 return karo
        if (!sellerId) return 0;

        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                let itemInfo = food_list.find((product) => product._id === itemId);
                if (itemInfo) {
                    // Dono ko String mein convert karke compare karo (Extra Safe)
                    const itemSellerId = String(itemInfo.sellerId?._id || itemInfo.sellerId);
                    const targetSellerId = String(sellerId);

                    if (itemSellerId === targetSellerId) {
                        totalAmount += itemInfo.price * cartItems[itemId];
                    }
                }
            }
        }
        return totalAmount;
    }
    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeToCart,
        getTotalCartAmount,
        getSellerSpecificTotal,
        url,
        token,
        setToken,
        fetchFoodList,
        loadUserData,
        userData,
        setUserData,
        categories,    
        fetchCategories,
         loading,
    }

    return (
        <storeContext.Provider value={contextValue}>
            {props.children}
        </storeContext.Provider>
    )
}

export default StoreContextProvider;

