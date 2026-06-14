import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const BillForm = ({ bill, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    Date: '',
    BillNumber: '',
    SellerId: '1'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bill) {
      setFormData({
        Date: bill.Date ? bill.Date.split('T')[0] : '',
        BillNumber: bill.BillNumber || '',
        SellerId: bill.SellerId || '1'
      });
    } else {
      const billNumber = `BR-${Date.now()}`;
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, BillNumber: billNumber, Date: today }));
    }
  }, [bill]);

  const validate = () => {
    const newErrors = {};
    if (!formData.Date) newErrors.Date = 'Datum je obavezan';
    if (!formData.BillNumber.trim()) newErrors.BillNumber = 'Broj računa je obavezan';
    if (!formData.SellerId) newErrors.SellerId = 'ID prodavača je obavezan';
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
    if (validate()) onSave(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Datum *</Form.Label>
        <Form.Control
          type="date"
          name="Date"
          value={formData.Date}
          onChange={handleChange}
          isInvalid={!!errors.Date}
        />
        <Form.Control.Feedback type="invalid">{errors.Date}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Broj računa *</Form.Label>
        <Form.Control
          type="text"
          name="BillNumber"
          value={formData.BillNumber}
          onChange={handleChange}
          isInvalid={!!errors.BillNumber}
        />
        <Form.Control.Feedback type="invalid">{errors.BillNumber}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>ID Prodavača *</Form.Label>
        <Form.Control
          type="number"
          name="SellerId"
          value={formData.SellerId}
          onChange={handleChange}
          isInvalid={!!errors.SellerId}
        />
        <Form.Control.Feedback type="invalid">{errors.SellerId}</Form.Control.Feedback>
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

export default BillForm;
