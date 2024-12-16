// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AProductList from "./AProductList";
import AddProduct from "./AddProduct";

const api = axios.create({
  baseURL: "https://api.satvikraas.com",
  withCredentials: true,
  validateStatus: (status) => {
    return (status >= 200 && status < 300) || status === 302;
  },
});

const AdminPP = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [btnName, setBtnName] = useState("ADD");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const getAccessToken = () => {
    return sessionStorage.getItem("accessToken");
  };

  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const accessToken = getAccessToken();

      if (!accessToken) {
        console.error("No access token found");
        return;
      }
      console.log("accessToken=" + accessToken);

      const response = await api.get("/api/productController/getAllProducts", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.data) {
        setProducts(response.data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlemodelopen = () => {
    if (isModalOpen) {
      setBtnName("ADD");
    } else setBtnName("Close");
    setModalOpen(!isModalOpen);
  };

  return (
    <div className="app">
      <div>
        <button onClick={handlemodelopen}>{btnName}</button>
        {isModalOpen && <AddProduct />}
        {/* {isModalOpen && <EditProduct />} */}
      </div>
      {isLoading && <div>Loading..........</div>}
      {!isModalOpen && !isLoading && <AProductList products={products} />}
    </div>
  );
};

export default AdminPP;
