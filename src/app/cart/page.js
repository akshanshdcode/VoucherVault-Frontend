"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [voucherIds, setVoucherIds] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      console.log("jwt token:" + token);
      try {
        const response = await fetch("https://vouchervault-6do6.onrender.com/api/user/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);

        setCartProducts(Array.isArray(data) ? data : data.cartItems || []);
      } catch (err) {
        setError("Failed to fetch cart.");
        toast.error("Failed to fetch cart.", {
          position: "top-right",
        });
      }
    };

    fetchCart();
  }, []);

  const handleApplyVouchers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://vouchervault-6do6.onrender.com/api/user/cart/apply-vouchers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ voucherIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to apply vouchers.");
      }

      const data = await response.json();
      toast.success("Vouchers applied successfully!", {
        position: "top-right",
      });
    } catch (err) {
      setError(err.message);
      toast.error("Error applying vouchers.", {
        position: "top-right",
      });
    }
  };

  const handleRemoveFromCart = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://vouchervault-6do6.onrender.com/api/user/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove product from cart.");
      }

      setCartProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      toast.success("Product removed from cart!", {
        position: "top-right",
      });
    } catch (err) {
      setError(err.message);
      toast.error("Error removing product from cart.", {
        position: "top-right",
      });
    }
  };

  return (
    <div>
      <Header />
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4">Your Cart</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cartProducts.length === 0 ? (
            <p>No products in your cart</p>
          ) : (
            cartProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg"
              >
                <h3 className="font-bold">{product.name}</h3>
                <p>{product.description}</p>
                <button
                  onClick={() => handleRemoveFromCart(product.id)}
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                >
                  Remove from Cart
                </button>
              </div>
            ))
          )}
        </div>
        <button
          onClick={handleApplyVouchers}
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
        >
          Proceed
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}