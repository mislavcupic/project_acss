const API_URL = 'http://localhost:3000';

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Došlo je do greške');
  }
  
  return response.json();
};

export const authAPI = {
  login: (email, password) => 
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
};

export const customerAPI = {
  getAll: async () => {
    const data = await apiCall('/customer');
    return data.map(c => ({
      Id: c.id,
      Name: c.name,
      Surname: c.surname,
      Email: c.email,
      Telephone: c.telephone,
      CityId: c.cityId
    }));
  },
  create: (data) => apiCall('/customer', {
    method: 'POST',
    body: JSON.stringify({
      name: data.Name,
      surname: data.Surname,
      email: data.Email,
      telephone: data.Telephone,
      cityId: parseInt(data.CityId)
    })
  }),
  update: (id, data) => apiCall(`/customer/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: data.Name,
      surname: data.Surname,
      email: data.Email,
      telephone: data.Telephone,
      cityId: parseInt(data.CityId)
    })
  }),
  delete: (id) => apiCall(`/customer/${id}`, { method: 'DELETE' })
};

export const billAPI = {
  getByCustomer: async (customerId) => {
    const data = await apiCall(`/bill?customerId=${customerId}`);
    return data.map(b => ({
      Id: b.id,
      Date: b.date,
      BillNumber: b.billNumber,
      SellerId: b.sellerId,
      CustomerId: b.customerId
    }));
  },
  create: (data) => apiCall('/bill', {
    method: 'POST',
    body: JSON.stringify({
      date: data.Date,
      billNumber: data.BillNumber,
      sellerId: parseInt(data.SellerId),
      customerId: data.CustomerId
    })
  }),
  update: (id, data) => apiCall(`/bill/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      date: data.Date,
      billNumber: data.BillNumber,
      sellerId: parseInt(data.SellerId),
      customerId: data.CustomerId  // ← dodano: PUT bez ovoga izgubi customerId
    })
  }),
  delete: (id) => apiCall(`/bill/${id}`, { method: 'DELETE' })
};

export const itemAPI = {
  getByBill: async (billId) => {
    const data = await apiCall(`/item?billId=${billId}`);
    return data.map(i => ({
      Id: i.id,
      ProductId: i.productId,
      BillId: i.billId,
      Quantity: i.quantity,
      TotalPrice: i.totalPrice
    }));
  },
  create: (data) => apiCall('/item', {
    method: 'POST',
    body: JSON.stringify({
      productId: data.ProductId,
      billId: data.BillId,
      quantity: data.Quantity,
      totalPrice: data.TotalPrice
    })
  }),
  update: (id, data) => apiCall(`/item/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      productId: data.ProductId,
      billId: data.BillId,     // ← dodano: PUT bez ovoga izgubi billId pa stavka nestane
      quantity: data.Quantity,
      totalPrice: data.TotalPrice
    })
  }),
  delete: (id) => apiCall(`/item/${id}`, { method: 'DELETE' })
};

export const cityAPI = {
  getAll: async () => {
    const data = await apiCall('/city');
    console.log('Raw city data from backend:', data);
    const mapped = data.map(city => ({
      Id: city.id,
      Name: city.name
    }));
    console.log('Mapped city data:', mapped);
    return mapped;
  }
};

export const productAPI = {
  getAll: async () => {
    const data = await apiCall('/product');
    return data.map(p => ({
      Id: p.id,
      Name: p.name,
      Price: p.price
    }));
  }
};