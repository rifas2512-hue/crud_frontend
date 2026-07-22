import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API = "https://crud-backend1-xmxc.onrender.com/api/products";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: ""
  });
  const [editId, setEditId] = useState(null);

  const getProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const saveProduct = async () => {
    if (!form.name || !form.price || !form.category) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editId === null) {
        await axios.post(API, form);
        setSuccess("Product added");
      } else {
        await axios.put(`${API}/${editId}`, form);
        setSuccess("Product updated");
        setEditId(null);
      }

      setForm({
        name: "",
        price: "",
        category: ""
      });

      await getProducts();

    } catch (err) {
      setError("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API}/${id}`);
      setSuccess("Product deleted");
      await getProducts();
    } catch (err) {
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (product) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({
      name: "",
      price: "",
      category: ""
    });
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div>
          <div className="app-title">Product Management</div>
          <div className="app-subtitle">Manage your product inventory</div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-number">{products.length}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>
      </header>

      <div className="main-card">
        <div className="message-container">
          {error && (
            <div className="message-box message-error">
              {error}
            </div>
          )}
          {success && (
            <div className="message-box message-success">
              {success}
            </div>
          )}
          {loading && (
            <div className="loading-indicator">Loading...</div>
          )}
        </div>

        <div className="form-section">
          <label className="section-label">
            {editId ? "Update Product" : "Add New Product"}
          </label>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter product name"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter price"
                name="price"
                value={form.price}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter category"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <button 
                className="btn btn-primary" 
                onClick={saveProduct} 
                disabled={loading}
              >
                {loading ? "Processing..." : (editId ? "Update" : "Add")}
              </button>
              {editId && (
                <button 
                  className="btn btn-secondary" 
                  onClick={cancelEdit} 
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <hr className="divider" />

        <div>
          <div className="products-header">
            <div className="products-title">Products</div>
            <div className="products-count">{products.length} items</div>
          </div>

          {products.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-state-text">No products available</div>
            </div>
          )}

          <div className="product-list">
            {products.map((product) => (
              <div className="product-item" key={product.id}>
                <div className="product-name">{product.name}</div>
                <div className="product-price">₹{product.price}</div>
                <div className="product-category">{product.category}</div>
                <div className="product-actions">
                  <button 
                    className="btn btn-edit" 
                    onClick={() => editProduct(product)} 
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-delete" 
                    onClick={() => deleteProduct(product.id)} 
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
