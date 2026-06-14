import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

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

    if (!formData.Name.trim()) newErrors.Name = 'Ime je obavezno';
    if (!formData.Surname.trim()) newErrors.Surname = 'Prezime je obavezno';
    if (!formData.Email.trim()) {
      newErrors.Email = 'Email je obavezan';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = 'Email nije ispravan';
    }
    if (!formData.Telephone.trim()) newErrors.Telephone = 'Telefon je obavezan';
    if (!formData.CityId) newErrors.CityId = 'Grad je obavezan';

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
        <Form.Label>Ime *</Form.Label>
        <Form.Control
          type="text"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          isInvalid={!!errors.Name}
        />
        <Form.Control.Feedback type="invalid">{errors.Name}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Prezime *</Form.Label>
        <Form.Control
          type="text"
          name="Surname"
          value={formData.Surname}
          onChange={handleChange}
          isInvalid={!!errors.Surname}
        />
        <Form.Control.Feedback type="invalid">{errors.Surname}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email *</Form.Label>
        <Form.Control
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          isInvalid={!!errors.Email}
        />
        <Form.Control.Feedback type="invalid">{errors.Email}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Telefon *</Form.Label>
        <Form.Control
          type="text"
          name="Telephone"
          value={formData.Telephone}
          onChange={handleChange}
          isInvalid={!!errors.Telephone}
        />
        <Form.Control.Feedback type="invalid">{errors.Telephone}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Grad *</Form.Label>
        <Form.Select
          name="CityId"
          value={formData.CityId}
          onChange={handleChange}
          isInvalid={!!errors.CityId}
        >
          <option value="">Odaberi grad</option>
          {cities.map(city => (
            <option key={city.Id} value={city.Id}>{city.Name}</option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.CityId}</Form.Control.Feedback>
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

export default CustomerForm;
