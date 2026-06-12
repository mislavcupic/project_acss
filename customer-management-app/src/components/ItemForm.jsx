import { useState, useEffect } from 'react';

const ItemForm = ({ item, products, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ProductId: '',
    Quantity: '1',
    TotalPrice: '0'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        ProductId: item.ProductId || '',
        Quantity: item.Quantity || '1',
        TotalPrice: item.TotalPrice || '0'
      });
    }
  }, [item]);

  // Automatski izračunaj cijenu
  useEffect(() => {
    if (formData.ProductId && formData.Quantity) {
      const product = products.find(p => p.Id === parseInt(formData.ProductId));
      if (product) {
        const total = product.Price * parseFloat(formData.Quantity);
        setFormData(prev => ({ ...prev, TotalPrice: total.toFixed(2) }));
      }
    }
  }, [formData.ProductId, formData.Quantity, products]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.ProductId) {
      newErrors.ProductId = 'Proizvod je obavezan';
    }
    
    if (!formData.Quantity || parseFloat(formData.Quantity) <= 0) {
      newErrors.Quantity = 'Količina mora biti veća od 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ProductId: parseInt(formData.ProductId),
        Quantity: parseFloat(formData.Quantity),
        TotalPrice: parseFloat(formData.TotalPrice)
      });
    }
  };

  const selectedProduct = products.find(p => p.Id === parseInt(formData.ProductId));

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Proizvod *</label>
        <select
          name="ProductId"
          value={formData.ProductId}
          onChange={handleChange}
        >
          <option value="">Odaberi proizvod</option>
          {products.map(product => (
            <option key={product.Id} value={product.Id}>
              {product.Name} - {product.Price} €
            </option>
          ))}
        </select>
        {errors.ProductId && <div className="error">{errors.ProductId}</div>}
      </div>

      {selectedProduct && (
        <div style={{ 
          padding: '10px', 
          background: '#e8f4f8', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#2c3e50' }}>
            Cijena po jedinici: <strong>{selectedProduct.Price} €</strong>
          </p>
        </div>
      )}

      <div className="form-group">
        <label>Količina *</label>
        <input
          type="number"
          name="Quantity"
          min="0.01"
          step="0.01"
          value={formData.Quantity}
          onChange={handleChange}
        />
        {errors.Quantity && <div className="error">{errors.Quantity}</div>}
      </div>

      <div className="form-group">
        <label>Ukupna cijena</label>
        <input
          type="number"
          value={formData.TotalPrice}
          disabled
          style={{ background: '#f5f5f5' }}
        />
      </div>

      <div className="modal-actions">
        <button type="button" onClick={onCancel} className="btn-primary">
          Odustani
        </button>
        <button type="submit" className="btn-success">
          Spremi
        </button>
      </div>
    </form>
  );
};

export default ItemForm;
