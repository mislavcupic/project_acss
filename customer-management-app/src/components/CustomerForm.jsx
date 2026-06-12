import { useState, useEffect } from 'react';

const CustomerForm = ({ customer, cities, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Surname: '',
    Email: '',
    Telephone: '',
    CityId: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData({
        Name: customer.Name || '',
        Surname: customer.Surname || '',
        Email: customer.Email || '',
        Telephone: customer.Telephone || '',
        CityId: customer.CityId || ''
      });
    }
  }, [customer]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Ime je obavezno';
    }
    
    if (!formData.Surname.trim()) {
      newErrors.Surname = 'Prezime je obavezno';
    }
    
    if (!formData.Email.trim()) {
      newErrors.Email = 'Email je obavezan';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = 'Email nije ispravan';
    }
    
    if (!formData.Telephone.trim()) {
      newErrors.Telephone = 'Telefon je obavezan';
    }
    
    if (!formData.CityId) {
      newErrors.CityId = 'Grad je obavezan';
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
        <label>Ime *</label>
        <input
          type="text"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
        />
        {errors.Name && <div className="error">{errors.Name}</div>}
      </div>

      <div className="form-group">
        <label>Prezime *</label>
        <input
          type="text"
          name="Surname"
          value={formData.Surname}
          onChange={handleChange}
        />
        {errors.Surname && <div className="error">{errors.Surname}</div>}
      </div>

      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
        />
        {errors.Email && <div className="error">{errors.Email}</div>}
      </div>

      <div className="form-group">
        <label>Telefon *</label>
        <input
          type="text"
          name="Telephone"
          value={formData.Telephone}
          onChange={handleChange}
        />
        {errors.Telephone && <div className="error">{errors.Telephone}</div>}
      </div>

      <div className="form-group">
        <label>Grad *</label>
        <select
          name="CityId"
          value={formData.CityId}
          onChange={handleChange}
        >
          <option value="">Odaberi grad</option>
          {cities.map(city => (
            <option key={city.Id} value={city.Id}>
              {city.Name}
            </option>
          ))}
        </select>
        {errors.CityId && <div className="error">{errors.CityId}</div>}
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

export default CustomerForm;
