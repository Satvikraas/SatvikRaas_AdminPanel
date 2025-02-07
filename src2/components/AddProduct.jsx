import React, { useState } from "react";
import axios from "axios";
import "./Addproduct.css";
const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    variants: [
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
  const getAccessToken = () => {
    return sessionStorage.getItem("accessToken");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();

    // form adding in objects
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("category", formData.category);

    formData.variants.forEach((variant, index) => {
      formDataToSubmit.append(`variant[${index}][weight]`, variant.weight);
      formDataToSubmit.append(`variant[${index}][price]`, variant.price);
      formDataToSubmit.append(
        `variant[${index}][stockQuantity]`,
        variant.stockQuantity
      );
      formDataToSubmit.append(`variant[${index}][discount]`, variant.discount);
      formDataToSubmit.append(
        `variant[${index}][mainImage]`,
        variant.mainImage
      );
      variant.subImages.forEach((subImage, subIndex) => {
        formDataToSubmit.append(
          `variant[${index}][subImages][${subIndex}]`,
          subImage
        );
      });
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
      await axios.post(
        "https://api.satvikraas.com/api/productController/saveProduct",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
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
          <h3>Details of {index + 1} Variant</h3>

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
            <label>Main Image *</label>
            <input
              type="file"
              onChange={(e) => handleMainImageChange(e, index)}
              required
            />
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

      <button type="button" onClick={addVariant} className="add-variant-button">
        Add Variant
      </button>

      <button type="submit" className="submit-button">
        Publish
      </button>
    </form>
  );
};

export default AddProduct;
