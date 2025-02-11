import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const api = axios.create({
  baseURL: "https://api.satvikraas.com",
  withCredentials: true,
});

const EditableProduct = ({ product }) => {
  // Ensure product exists before accessing its properties
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const getAccessToken = () => {
    return sessionStorage.getItem("accessToken");
  };

  const editProduct = () => {
    // Navigate to product details page with product data
    navigate(`/EditProduct`, {
      state: {
        product: product,
        returnPath: location.pathname,
      },
    });
  };

  // Add loading state for initial product data
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-card">
      {error && <div className="error-message">{error}</div>}

      <img
        src={`data:image/jpeg;base64,${selectedVariant?.mainImage}`}
        className="product-image"
        alt={product.name}
      />

      <h3>{product.name}</h3>

      {selectedVariant && (
        <>
          <p>Price: {selectedVariant.price}</p>

          {selectedVariant.discount > 0 && (
            <p>Discount: {selectedVariant.discount}%</p>
          )}
        </>
      )}

      <div className="variant-buttons">
        {product.variants?.map((variant, index) => (
          <button
            key={index}
            className={variant === selectedVariant ? "active" : ""}
            onClick={() => handleVariantChange(variant)}
          >
            {variant.weight} g
          </button>
        ))}
      </div>

      <button
        onClick={editProduct}
        // disabled={loading}
        disabled
        className="add-cart-button"
      >
        {loading ? "Adding..." : "EDIT"}
      </button>
    </div>
  );
};

export default EditableProduct;
