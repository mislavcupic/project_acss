import { useState, useEffect, useContext } from 'react';
import { itemAPI, productAPI } from '../api';
import ItemForm from './ItemForm';


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
    return <div className="loading">Učitavanje stavki...</div>;
  }

  return (
    <div>
      <button onClick={handleAdd} className="btn-success">
        + Dodaj stavku
      </button>
      
      <button onClick={onClose} className="btn-primary" style={{ marginLeft: '10px' }}>
        Zatvori
      </button>

      {items.length === 0 ? (
        <p style={{ marginTop: '20px' }}>Nema stavki za prikaz</p>
      ) : (
        <div className="table-container" style={{ marginTop: '20px' }}>
          <table>
            <thead>
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
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="btn-warning btn-small"
                      >
                        Uredi
                      </button>
                      <button 
                        onClick={() => handleDelete(item)}
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

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedItem ? 'Uredi stavku' : 'Dodaj stavku'}</h2>
            <ItemForm
              item={selectedItem}
              products={products}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  
  );
};

export default BillItems;
