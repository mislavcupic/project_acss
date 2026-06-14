import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

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
    if (!formData.ProductId) newErrors.ProductId = 'Proizvod je obavezan';
    if (!formData.Quantity || parseFloat(formData.Quantity) <= 0)
      newErrors.Quantity = 'Količina mora biti veća od 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Proizvod *</Form.Label>
        <Form.Select
          name="ProductId"
          value={formData.ProductId}
          onChange={handleChange}
          isInvalid={!!errors.ProductId}
        >
          <option value="">Odaberi proizvod</option>
          {products.map(product => (
            <option key={product.Id} value={product.Id}>
              {product.Name} - {product.Price} €
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.ProductId}</Form.Control.Feedback>
      </Form.Group>

      {selectedProduct && (
        <Alert variant="info" className="py-2">
          Cijena po jedinici: <strong>{selectedProduct.Price} €</strong>
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Količina *</Form.Label>
        <Form.Control
          type="number"
          name="Quantity"
          min="0.01"
          step="0.01"
          value={formData.Quantity}
          onChange={handleChange}
          isInvalid={!!errors.Quantity}
        />
        <Form.Control.Feedback type="invalid">{errors.Quantity}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Ukupna cijena</Form.Label>
        <Form.Control
          type="number"
          value={formData.TotalPrice}
          disabled
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="outline-dark" type="button" onClick={onCancel}>
          Odustani
        </Button>
        <Button variant="dark" type="submit">
          Spremi
        </Button>
      </div>
    </Form>
  );
};

export default ItemForm;
