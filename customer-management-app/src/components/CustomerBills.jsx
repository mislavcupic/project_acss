import { useState, useEffect } from 'react';
import { billAPI } from '../api';
import BillForm from './BillForm';
import BillItems from './BillItems';
import { Table, Button, Spinner, Modal } from 'react-bootstrap';

const CustomerBills = ({ customerId, onClose }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBillForm, setShowBillForm] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    loadBills();
  }, [customerId]);

  const loadBills = async () => {
    try {
      setLoading(true);
      const data = await billAPI.getByCustomer(customerId);
      setBills(data);
    } catch (err) {
      alert('Greška pri učitavanju računa: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = () => {
    setSelectedBill(null);
    setShowBillForm(true);
  };

  const handleEditBill = (bill) => {
    setSelectedBill(bill);
    setShowBillForm(true);
  };

  const handleDeleteBill = async (bill) => {
    if (!window.confirm('Obrisati račun?')) return;
    try {
      await billAPI.delete(bill.Id);
      loadBills();
    } catch (err) {
      alert('Greška pri brisanju: ' + err.message);
    }
  };

  const handleViewItems = (bill) => {
    setSelectedBill(bill);
    setShowItems(true);
  };

  const handleSaveBill = async (data) => {
    try {
      const billData = { ...data, CustomerId: customerId };
      if (selectedBill) {
        await billAPI.update(selectedBill.Id, billData);
      } else {
        await billAPI.create(billData);
      }
      setShowBillForm(false);
      loadBills();
    } catch (err) {
      alert('Greška pri spremanju: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex gap-2 mb-3">
        <Button variant="dark" onClick={handleAddBill}>
          + Dodaj račun
        </Button>
        <Button variant="outline-dark" onClick={onClose}>
          Zatvori
        </Button>
      </div>

      {bills.length === 0 ? (
        <p className="text-muted">Nema računa za prikaz</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Broj računa</th>
              <th>Datum</th>
              <th>Prodavač ID</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill.Id}>
                <td>{bill.BillNumber}</td>
                <td>{new Date(bill.Date).toLocaleDateString('hr-HR')}</td>
                <td>{bill.SellerId}</td>
                <td>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button size="sm" variant="dark" onClick={() => handleViewItems(bill)}>
                      Stavke
                    </Button>
                    <Button size="sm" variant="warning" onClick={() => handleEditBill(bill)}>
                      Uredi
                    </Button>
                    <Button size="sm" variant="outline-dark" onClick={() => handleDeleteBill(bill)}>
                      Obriši
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal — dodaj/uredi račun */}
      <Modal show={showBillForm} onHide={() => setShowBillForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedBill ? 'Uredi račun' : 'Dodaj račun'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BillForm
            bill={selectedBill}
            onSave={handleSaveBill}
            onCancel={() => setShowBillForm(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Modal — stavke računa */}
      <Modal show={showItems} onHide={() => setShowItems(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Stavke računa #{selectedBill?.BillNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BillItems
            billId={selectedBill?.Id}
            onClose={() => setShowItems(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CustomerBills;
