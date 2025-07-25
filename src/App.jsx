/*Product Card Manager*/
import React, { useEffect, useState } from "react";
import { Package, PackagePlusIcon, X, Check, Image, Edit2 } from "lucide-react";

function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
    info: "",
  });

  const resetForm = () => {
    setFormData({ name: "", image: "", price: "", info: "" });
    setShowForm(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.price.trim()) {
      alert("Please fill all required fields");
      return;
    }

    const parsedPrice = parseFloat(formData.price) || 0;

    if (editingId) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingId
            ? { ...formData, id: editingId, price: parsedPrice }
            : product
        )
      );
    } else {
      const newProduct = {
        id: Date.now(),
        ...formData,
        price: parsedPrice,
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    resetForm();
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      image: product.image,
      price: product.price.toString(),
      info: product.info,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((product) => product.id !== id));
    }
  };

  return (
    <div className="body">
      <h1 className="heading">Product Card Manager</h1>
      <p className="sub-heading">Create and Manage Beautiful Product Cards</p>
      <button className="btn" onClick={() => setShowForm(true)}>
        Add New Product <PackagePlusIcon size={20} />
      </button>

      {showForm && (
        <div
          className="modal"
          onClick={(e) => e.target === e.currentTarget && resetForm()}
        >
          <div className="modal-content">
            <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
            <button className="close" onClick={resetForm}>
              <X size={20} />
            </button>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="url"
              name="image"
              placeholder="Image URL (optional)"
              value={formData.image}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="info"
              placeholder="Product Info"
              value={formData.info}
              onChange={handleInputChange}
            ></textarea>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-reset" onClick={resetForm}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleSubmit}>
                <Check size={18} /> {editingId ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="empty-state">
          <Package size={80} />
          <h3>No Products Yet</h3>
          <p>Click "Add New Product" to create your product card.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="card-image-container">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-image"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const placeholder = e.target.nextElementSibling;
                      if (placeholder) placeholder.style.display = "flex";
                    }}
                  />
                ) : null}

                {product.image && (
                  <div className="image-placeholder" style={{ display: "none" }}>
                    <Image size={48} />
                  </div>
                )}

                <div className="card-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="card-content">
                <h3>{product.name}</h3>
                <div className="price-value">
                  <p>${Number(product.price).toFixed(2)}</p>
                </div>
                {product.info && <p className="info">{product.info}</p>}
                <button>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
