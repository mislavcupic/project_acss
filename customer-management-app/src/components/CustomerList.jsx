import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { customerAPI, cityAPI } from '../api';
import CustomerForm from './CustomerForm';
import CustomerBills from './CustomerBills';
import { Protected } from './Protected';
import {
  Container, Row, Col, Table, Button, Form,
  Spinner, Alert, Modal, Pagination
} from 'react-bootstrap';

const CustomerList = () => {
  const { isAuthenticated } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('Name');
  const [sortDirection, setSortDirection] = useState('asc');

  const [showForm, setShowForm] = useState(false);
  const [showBills, setShowBills] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

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
    if (!window.confirm(`Obrisati kupca ${customer.Name} ${customer.Surname}?`)) return;
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
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Greška: {error}</Alert>
        <Button variant="dark" onClick={loadData}>Pokušaj ponovno</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Popis kupaca</h2>

      <Row className="mb-3 g-2 align-items-center">
        <Col xs={12} md={5}>
          <Form.Control
            type="text"
            placeholder="Pretraži kupce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col xs="auto">
          <Form.Select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Form.Select>
        </Col>
        {isAuthenticated && (
          <Col xs="auto">
            <Button variant="dark" onClick={handleAdd}>
              + Dodaj kupca
            </Button>
          </Col>
        )}
      </Row>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            {/* strelica možemo i ovako{"\u2191"}*/}
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('Name')}>
              Ime {sortField === 'Name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('Surname')}>
              Prezime {sortField === 'Surname' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('Email')}>
              Email {sortField === 'Email' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => handleSort('Telephone')}>
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
                <Protected>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button size="sm" variant="info" onClick={() => handleViewBills(customer)}>
                      Računi
                    </Button>
                    <Button size="sm" variant="warning" onClick={() => handleEdit(customer)}>
                      Uredi
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(customer)}>
                      Obriši
                    </Button>
                  </div>
                </Protected>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-2">
        <span className="text-muted small">
          Prikazano {startIndex + 1} - {Math.min(startIndex + pageSize, sortedCustomers.length)} od {sortedCustomers.length}
        </span>
        <Pagination className="mb-0">
          <Pagination.Prev
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
          />
          <Pagination.Item active>{currentPage} od {totalPages}</Pagination.Item>
          <Pagination.Next
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>

      {/* Modal — dodaj/uredi kupca */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCustomer ? 'Uredi kupca' : 'Dodaj kupca'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomerForm
            customer={selectedCustomer}
            cities={cities}
            onSave={handleSaveCustomer}
            onCancel={() => setShowForm(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Modal — računi kupca */}
      <Modal show={showBills} onHide={() => setShowBills(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Računi — {selectedCustomer?.Name} {selectedCustomer?.Surname}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomerBills
            customerId={selectedCustomer?.Id}
            onClose={() => setShowBills(false)}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CustomerList;
