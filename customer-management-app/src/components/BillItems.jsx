import { useState, useEffect } from 'react';
import { itemAPI, productAPI } from '../api';
import ItemForm from './ItemForm';
import { Protected } from './Protected';
import { Table, Button, Spinner, Modal } from 'react-bootstrap';

const BillItems = ({ billId, onClose }) => {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadData();
  }, [billId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsData, productsData] = await Promise.all([
        itemAPI.getByBill(billId),
        productAPI.getAll()
      ]);
      setItems(itemsData);
      setProducts(productsData);
    } catch (err) {
      alert('Greška pri učitavanju: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Obrisati stavku?')) return;
    try {
      await itemAPI.delete(item.Id);
      loadData();
    } catch (err) {
      alert('Greška pri brisanju: ' + err.message);
    }
  };

  const handleSave = async (data) => {
    try {
      const itemData = { ...data, BillId: billId };
      if (selectedItem) {
        await itemAPI.update(selectedItem.Id, itemData);
      } else {
        await itemAPI.create(itemData);
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      alert('Greška pri spremanju: ' + err.message);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.Id === productId);
    return product ? product.Name : '-';
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
        <Button variant="dark" onClick={handleAdd}>
          + Dodaj stavku
        </Button>
        <Button variant="outline-dark" onClick={onClose}>
          Zatvori
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted">Nema stavki za prikaz</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Proizvod</th>
              <th>Količina</th>
              <th>Ukupna cijena</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.Id}>
                <td>{getProductName(item.ProductId)}</td>
                <td>{item.Quantity}</td>
                <td>{Number(item.TotalPrice).toFixed(2)} €</td>
                <td>
                  <Protected>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button size="sm" variant="warning" onClick={() => handleEdit(item)}>
                        Uredi
                      </Button>
                      <Button size="sm" variant="outline-dark" onClick={() => handleDelete(item)}>
                        Obriši
                      </Button>
                    </div>
                  </Protected>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal — dodaj/uredi stavku */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem ? 'Uredi stavku' : 'Dodaj stavku'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ItemForm
            item={selectedItem}
            products={products}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BillItems;
