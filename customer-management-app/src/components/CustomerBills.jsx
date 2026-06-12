import { useState, useEffect } from 'react';
import { billAPI, itemAPI, productAPI } from '../api';
import BillForm from './BillForm';
import BillItems from './BillItems';

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
    return <div className="loading">Učitavanje računa...</div>;
  }

  return (
    <div>
      <button onClick={handleAddBill} className="btn-success">
        + Dodaj račun
      </button>
      
      <button onClick={onClose} className="btn-primary" style={{ marginLeft: '10px' }}>
        Zatvori
      </button>

      {bills.length === 0 ? (
        <p style={{ marginTop: '20px' }}>Nema računa za prikaz</p>
      ) : (
        <div className="table-container" style={{ marginTop: '20px' }}>
          <table>
            <thead>
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
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleViewItems(bill)}
                        className="btn-primary btn-small"
                      >
                        Stavke
                      </button>
                      <button 
                        onClick={() => handleEditBill(bill)}
                        className="btn-warning btn-small"
                      >
                        Uredi
                      </button>
                      <button 
                        onClick={() => handleDeleteBill(bill)}
                        className="btn-danger btn-small"
                      >
                        Obriši
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showBillForm && (
        <div className="modal-overlay" onClick={() => setShowBillForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedBill ? 'Uredi račun' : 'Dodaj račun'}</h2>
            <BillForm
              bill={selectedBill}
              onSave={handleSaveBill}
              onCancel={() => setShowBillForm(false)}
            />
          </div>
        </div>
      )}

      {showItems && selectedBill && (
        <div className="modal-overlay" onClick={() => setShowItems(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Stavke računa #{selectedBill.BillNumber}</h2>
            <BillItems
              billId={selectedBill.Id}
              onClose={() => setShowItems(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBills;
