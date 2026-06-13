import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { customerAPI, cityAPI } from '../api';
import CustomerForm from './CustomerForm';
import CustomerBills from './CustomerBills';
import { Protected } from './Protected';
const CustomerList = () => {
  const { isAuthenticated } = useAuth();
  
  // State
  const [customers, setCustomers] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Search i Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('Name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Modals
  const [showForm, setShowForm] = useState(false);
  const [showBills, setShowBills] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Učitaj podatke
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [customersData, citiesData] = await Promise.all([
        customerAPI.getAll(),
        cityAPI.getAll()
      ]);
      setCustomers(customersData);
      setCities(citiesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      customer.Name?.toLowerCase().includes(query) ||
      customer.Surname?.toLowerCase().includes(query) ||
      customer.Email?.toLowerCase().includes(query) ||
      customer.Telephone?.toLowerCase().includes(query)
    );
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedCustomers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCustomers = sortedCustomers.slice(startIndex, startIndex + pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (customer) => {
    if (!window.confirm(`Obrisati kupca ${customer.Name} ${customer.Surname}?`)) {
      return;
    }
    
    try {
      await customerAPI.delete(customer.Id);
      loadData();
    } catch (err) {
      alert('Greška pri brisanju: ' + err.message);
    }
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const handleViewBills = (customer) => {
    setSelectedCustomer(customer);
    setShowBills(true);
  };

  const handleSaveCustomer = async (data) => {
    try {
      if (selectedCustomer) {
        await customerAPI.update(selectedCustomer.Id, data);
      } else {
        await customerAPI.create(data);
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      alert('Greška pri spremanju: ' + err.message);
    }
  };

  const getCityName = (cityId) => {
    const city = cities.find(c => c.Id === cityId);
    return city ? city.Name : '-';
  };

  if (loading) {
    return <div className="loading">Učitavanje...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Greška: {error}</div>
        <button onClick={loadData} className="btn-primary">Pokušaj ponovno</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Popis kupaca</h2>
      
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Pretraži kupce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div>
          <label>Prikaži: </label>
          <select value={pageSize} onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        
        {isAuthenticated && (
          <button onClick={handleAdd} className="btn-success">
            + Dodaj kupca
          </button>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('Name')}>
                Ime {sortField === 'Name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('Surname')}>
                Prezime {sortField === 'Surname' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('Email')}>
                Email {sortField === 'Email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('Telephone')}>
                Telefon {sortField === 'Telephone' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Grad</th>
              {isAuthenticated && <th>Akcije</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map(customer => (
              <tr key={customer.Id}>
                <td>{customer.Name}</td>
                <td>{customer.Surname}</td>
                <td>{customer.Email}</td>
                <td>{customer.Telephone}</td>
                <td>{getCityName(customer.CityId)}</td>
                
                  <td>
                    <div className="action-buttons">
                      <Protected>
                      <button 
                        onClick={() => handleViewBills(customer)}
                        className="btn-primary btn-small"
                      >
                        Računi
                      </button>
                      
                      <button 
                        onClick={() => handleEdit(customer)}
                        className="btn-warning btn-small"
                      >
                        Uredi
                      </button>
                      <button 
                        onClick={() => handleDelete(customer)}
                        className="btn-danger btn-small"
                      >
                        Obriši
                      </button>
                      </Protected>
                    </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div>
          Prikazano {startIndex + 1} - {Math.min(startIndex + pageSize, sortedCustomers.length)} od {sortedCustomers.length}
        </div>
        <div className="pagination-buttons">
          <button 
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
            className="btn-primary"
          >
            Prethodna
          </button>
          <span>Stranica {currentPage} od {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
            className="btn-primary"
          >
            Sljedeća
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCustomer ? 'Uredi kupca' : 'Dodaj kupca'}</h2>
            <CustomerForm
              customer={selectedCustomer}
              cities={cities}
              onSave={handleSaveCustomer}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {showBills && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowBills(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Računi - {selectedCustomer.Name} {selectedCustomer.Surname}</h2>
            <CustomerBills 
              customerId={selectedCustomer.Id}
              onClose={() => setShowBills(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
