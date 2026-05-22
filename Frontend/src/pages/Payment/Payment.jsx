import React, { useEffect, useState, useContext } from 'react';
import { storeContext } from '../../context/StoreContext';
import axios from 'axios';
import "./Payment.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Payment = () => {

    console.log(window.location.origin)
    const { url, token, getTotalCartAmount } = useContext(storeContext);
    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0); 
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Order ID check aur set karna
        const savedOrderId = localStorage.getItem("lastOrderId");
        if (savedOrderId) {
            setOrderId(savedOrderId);
        } else {
            toast.error("No Order ID found!");
            navigate('/cart');
            return; 
        }

        // 2. Solid LocalStorage Amount Logic

        const storedAmount = Number(localStorage.getItem("tempPayAmount")) || 0;

setTotalAmount(storedAmount);

if (storedAmount === 0) {
   toast.error("Invalid checkout transaction.");
   navigate('/cart');
}

    }, [navigate, getTotalCartAmount]);

    // Razorpay Gateway Handler Function
    const initPayment = (orderData) => {
        console.log("RAZORPAY ORDER OBJECT FROM BACKEND:", orderData);

        // Frontend ENV se dynamically check karo ya strict backup key lagao
        const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SqhTRuQrSfaPwx";


   const options = {
    key: rzpKey,
    amount: orderData.amount,
    currency: "INR",
    name: "Romato Delivery",
    description: "Food Payment",
    order_id: orderData.id,

    remember_customer: false,
    send_sms_hash: false,

    method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true
    },

   config: {
   display: {
      language: "en",
      blocks: {
         upi: {
            name: "UPI",
            instruments: [
               {
                  method: "upi"
               }
            ]
         },

         cards: {
            name: "Cards",
            instruments: [
               {
                  method: "card"
               }
            ]
         }
      },

      sequence: ["block.upi", "block.cards"],

      preferences: {
         show_default_blocks: false
      }
   }
},

    handler: async function (response) {

        try {

            const { data } = await axios.post(
                `${url}/api/order/verify`,
                {
                    orderId,
                    success: true,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                },
                {
                    headers: { token }
                }
            );

            if (data.success) {
                toast.success("Payment Success");

                localStorage.removeItem("lastOrderId");
                localStorage.removeItem("tempPayAmount");

                navigate("/");
            }

        } catch (err) {
            console.log(err);
            toast.error("Verification Failed");
        }
    },

    modal: {
        ondismiss: function () {
            console.log("Checkout closed");
        }
    },

    prefill: {
        name: "Rahul",
        email: "rahul@gmail.com",
        contact: "9876543210"
    },

    theme: {
        color: "#ff4c24"
    }
};
        
const rzp1 = new window.Razorpay(options);

rzp1.on('payment.failed', function (response){
   console.log(response.error);
});

rzp1.open();
        // const rzp1 = new window.Razorpay(options);
        // rzp1.open();
    };

    const handleRazorpayPayment = async () => {
        const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SqhTRuQrSfaPwx";
        console.log("FRONTEND RAZORPAY KEY ID:", rzpKey);
        
        setLoading(true);
        try {
            const currentOrderId = orderId || localStorage.getItem("lastOrderId");
            const orderUrl = `${url}/api/order/razorpay`;
            
            const response = await axios.post(orderUrl, { 
                orderId: currentOrderId,
                amount: totalAmount 
            }, { headers: { token } });

            if (response.data.success) {
                initPayment(response.data.order);
            } else {
                toast.error(response.data.message || "Failed to initiate Razorpay order.");
            }
        } catch (error) {
            console.error("Razorpay Init Error:", error);
            toast.error("Could not connect to payment gateway.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='payment-page'>
            <div className='payment-card'>
                <h2>Secure Checkout</h2>
                <div className="order-summary-box">
                    <p>Order ID: <span>{orderId}</span></p>
                    <p className="amount-display">Amount to Pay: <span>₹{totalAmount}</span></p>
                </div>

                <div className="gateway-branding">
                    <p>Secured by <b>Razorpay</b></p>
                    <div className="payment-badges">
                        <span>UPI</span> • <span>Cards</span> • <span>NetBanking</span> • <span>Wallets</span>
                    </div>
                </div>

                <button onClick={handleRazorpayPayment} className='btn-pay-now' disabled={loading || totalAmount === 0}>
                    {loading ? "Opening Secure Gateway..." : `PROCEED TO PAY ₹${totalAmount}`}
                </button>
            </div>
        </div>
    );
};

export default Payment;
