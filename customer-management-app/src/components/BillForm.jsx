import { useState, useEffect } from 'react';

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
      // Generiraj automatski broj računa
      const billNumber = `BR-${Date.now()}`;
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        BillNumber: billNumber,
        Date: today
      }));
    }
  }, [bill]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.Date) {
      newErrors.Date = 'Datum je obavezan';
    }
    
    if (!formData.BillNumber.trim()) {
      newErrors.BillNumber = 'Broj računa je obavezan';
    }
    
    if (!formData.SellerId) {
      newErrors.SellerId = 'ID prodavača je obavezan';
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
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Datum *</label>
        <input
          type="date"
          name="Date"
          value={formData.Date}
          onChange={handleChange}
        />
        {errors.Date && <div className="error">{errors.Date}</div>}
      </div>

      <div className="form-group">
        <label>Broj računa *</label>
        <input
          type="text"
          name="BillNumber"
          value={formData.BillNumber}
          onChange={handleChange}
        />
        {errors.BillNumber && <div className="error">{errors.BillNumber}</div>}
      </div>

      <div className="form-group">
        <label>ID Prodavača *</label>
        <input
          type="number"
          name="SellerId"
          value={formData.SellerId}
          onChange={handleChange}
        />
        {errors.SellerId && <div className="error">{errors.SellerId}</div>}
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

export default BillForm;
