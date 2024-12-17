import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Addproduct.css";

const EditProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const existingProduct = location.state?.product;
  const returnPath = location.state?.returnPath;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    productId: "",
    variants: [],
  });

  // Initialize form with existing product data
  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || "",
        description: existingProduct.description || "",
        category: existingProduct.category || "",
        productId: existingProduct.productId || "",
        variants: existingProduct.variants.map((variant) => ({
          ...variant,
          mainImage: null, // Reset file inputs as they can't be pre-filled
          subImages: null,
          weight: variant.weight || "",
          price: variant.price || "",
          stockQuantity: variant.stockQuantity || "",
          discount: variant.discount || "",
          offerStartDate: variant.offerStartDate || "",
          offerEndDate: variant.offerEndDate || "",
        })),
      });
    }
  }, [existingProduct]);

  const handleCancel = () => {
    if (returnPath) {
      // If we have a specific return path, use it
      navigate(returnPath);
    } else {
      // Otherwise go back to previous page
      navigate(-1);
    }
  };

  const handleInputChange = (e, index, field) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = e.target.value;
    setFormData({ ...formData, variants: newVariants });
  };

  const handleMainImageChange = (e, index) => {
    const newVariants = [...formData.variants];
    newVariants[index].mainImage = e.target.files[0];
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubImageChange = (e, index) => {
    const newVariants = [...formData.variants];
    newVariants[index].subImages = Array.from(e.target.files);
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          weight: "",
          price: "",
          stockQuantity: "",
          discount: "",
          mainImage: null,
          subImages: [],
          offerStartDate: "",
          offerEndDate: "",
        },
      ],
    });
  };

  const removeVariant = (indexToRemove) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, index) => index !== indexToRemove),
    });
  };

  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("category", formData.category);
    formDataToSubmit.append("productId", formData.productId);

    formData.variants.forEach((variant, index) => {
      formDataToSubmit.append(`variant[${index}][weight]`, variant.weight);
      formDataToSubmit.append(`variant[${index}][price]`, variant.price);
      formDataToSubmit.append(
        `variant[${index}][stockQuantity]`,
        variant.stockQuantity
      );
      formDataToSubmit.append(`variant[${index}][discount]`, variant.discount);
      if (variant.mainImage) {
        formDataToSubmit.append(
          `variant[${index}][mainImage]`,
          variant.mainImage
        );
      }
      if (variant.subImages.length > 0) {
        variant.subImages.forEach((subImage, subIndex) => {
          formDataToSubmit.append(
            `variant[${index}][subImages][${subIndex}]`,
            subImage
          );
        });
      }
      formDataToSubmit.append(
        `variant[${index}][offerStartDate]`,
        variant.offerStartDate
      );
      formDataToSubmit.append(
        `variant[${index}][offerEndDate]`,
        variant.offerEndDate
      );
    });

    const accessToken = getAccessToken();

    try {
      const endpoint = existingProduct
        ? `http://localhost:8080/api/productController/updateProduct/${formData.productId}`
        : "http://localhost:8080/api/productController/saveProduct";

      await axios.post(endpoint, formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert(
        existingProduct
          ? "Product updated successfully"
          : "Product added successfully"
      );
      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      <h2>{existingProduct ? "Edit Product" : "Add New Product"}</h2>

      <div className="input-group">
        <label>Title/Product Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="input-group">
        <label>Category *</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
        />
      </div>

      <div className="input-group">
        <label>Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>

      {formData.variants.map((variant, index) => (
        <div key={index} className="variant-section">
          <div className="variant-header">
            <h3>Details of Variant {index + 1}</h3>
            <button
              type="button"
              className="remove-variant-button"
              onClick={() => removeVariant(index)}
            >
              Remove Variant
            </button>
          </div>

          <div className="input-group">
            <label>Weight *</label>
            <input
              type="text"
              value={variant.weight}
              onChange={(e) => handleInputChange(e, index, "weight")}
              required
            />
          </div>

          <div className="input-group">
            <label>Stock Quantity *</label>
            <input
              type="number"
              value={variant.stockQuantity}
              onChange={(e) => handleInputChange(e, index, "stockQuantity")}
              required
            />
          </div>

          <div className="input-group">
            <label>Price *</label>
            <input
              type="number"
              value={variant.price}
              onChange={(e) => handleInputChange(e, index, "price")}
              required
            />
          </div>

          <div className="input-group">
            <label>Discount *</label>
            <input
              type="number"
              value={variant.discount}
              onChange={(e) => handleInputChange(e, index, "discount")}
              required
            />
          </div>

          <div className="input-group">
            <label>Main Image {!existingProduct && "*"}</label>
            <input
              type="file"
              onChange={(e) => handleMainImageChange(e, index)}
              required={!existingProduct}
            />
            {existingProduct && variant.mainImage && (
              <img
                src={`data:image/jpeg;base64,${variant.mainImage}`}
                alt="Current main image"
                className="preview-image"
              />
            )}
          </div>

          <div className="input-group">
            <label>Sub Images</label>
            <input
              type="file"
              multiple
              onChange={(e) => handleSubImageChange(e, index)}
            />
          </div>

          <div className="input-group">
            <label>Offer Start Date *</label>
            <input
              type="date"
              value={variant.offerStartDate}
              onChange={(e) => handleInputChange(e, index, "offerStartDate")}
              required
            />
          </div>

          <div className="input-group">
            <label>Offer End Date *</label>
            <input
              type="date"
              value={variant.offerEndDate}
              onChange={(e) => handleInputChange(e, index, "offerEndDate")}
              required
            />
          </div>
        </div>
      ))}

      <div className="button-group" style={{ display: "flex", gap: "10px" }}>
        <button
          type="button"
          onClick={addVariant}
          className="add-variant-button"
        >
          Add Variant
        </button>

        <button type="submit" className="submit-button">
          {existingProduct ? "Update Product" : "Publish Product"}
        </button>

        <button type="button" className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditProduct;
