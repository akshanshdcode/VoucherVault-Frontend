"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://vouchervault-6do6.onrender.com/api/product/all");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched products:", data);

        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
        setError("Failed to fetch products.");
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/api/user/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: productId }),
      });
  
      console.log("Response Status: ", response.status);
      const responseText = await response.text();
  
      console.log("Response Text: ", responseText);
  
      if (response.status === 200 && responseText === "Product added to cart successfully") {
        toast.success("Product added to cart!", {
          position: "top-right",
        });
      } else {
        toast.error("Error: Invalid response from server.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setError(error.message);
      toast.error("Error adding product to cart.", {
        position: "top-right",
      });
    }
  };     

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4">Products</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="font-bold text-white">{product.name}</h3>
              <p className="text-gray-300">{product.description}</p>
              <button
                onClick={() => handleAddToCart(product.id)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}