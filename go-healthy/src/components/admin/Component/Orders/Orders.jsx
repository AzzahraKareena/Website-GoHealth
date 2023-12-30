import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableRow,
} from '@coreui/react';

function OrderPage() {
  const [dataOrder, setDataOrder] = useState([]);

  useEffect(() => {
    getDataOrder();
  }, []);

  const getDataOrder = async () => {
    try {
      const response = await axios.get('http://localhost:8080/orders');
      setDataOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`http://localhost:8080/updateStatus/${orderId}`, { status });

      // Ambil ulang data pesanan setelah pembaruan
      getDataOrder();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8080/delete/order/${orderId}`);

      // Ambil ulang data pesanan setelah penghapusan
      getDataOrder();

      // Tampilkan alert ketika penghapusan berhasil
      alert('Data pesanan berhasil dihapus.');
    } catch (error) {
      console.error('Error deleting order:', error);
      // Tampilkan alert ketika terjadi kesalahan saat penghapusan
      alert('Terjadi kesalahan saat menghapus pesanan.');
    }
  };

  return (
    <div className="body-flex">
      <div className="flex">
        <div className="col-10 p-5">
          <h2 className="py-2">List Order</h2>
          <CTable bordered striped>
            <CTableHead>
              <CTableRow>
                <CTableDataCell className="fw-bold">Nama Pelanggan</CTableDataCell>
                <CTableDataCell className="fw-bold">Phone</CTableDataCell>
                <CTableDataCell className="fw-bold">Alamat</CTableDataCell>
                <CTableDataCell className="fw-bold">Metode Pembayaran</CTableDataCell>
                <CTableDataCell className="fw-bold">Total Harga</CTableDataCell>
                <CTableDataCell className="fw-bold">Tanggal Pesan</CTableDataCell>
                <CTableDataCell className="fw-bold">Item yang Dibeli</CTableDataCell>
                <CTableDataCell className="fw-bold">Status</CTableDataCell>
                <CTableDataCell className="fw-bold">Actions</CTableDataCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {dataOrder &&
                dataOrder.length > 0 &&
                dataOrder.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{item.name}</CTableDataCell>
                    <CTableDataCell>{item.phone}</CTableDataCell>
                    <CTableDataCell>{item.address}</CTableDataCell>
                    <CTableDataCell>{item.paymentMethod}</CTableDataCell>
                    <CTableDataCell>{item.totalAmount}</CTableDataCell>
                    <CTableDataCell>{item.created_at}</CTableDataCell>
                    <CTableDataCell>
                      <ul>
                        {item.items &&
                          JSON.parse(item.items).map((orderItem, i) => (
                            <li key={i}>
                              ID: {orderItem.id}, Nama: {orderItem.title}, Quantity: {orderItem.quantity}, Harga: {orderItem.price}, Total: {orderItem.price * orderItem.quantity}
                            </li>
                          ))}
                      </ul>
                    </CTableDataCell>
                    <CTableDataCell>{item.status}</CTableDataCell>
                    <CTableDataCell>
                      <div className="action-buttons">
                        <CButton
                          className={item.status === 'accepted' ? 'btn btn-info' : 'btn btn-secondary'}
                          onClick={() => updateOrderStatus(item.id, 'accepted')}
                          style={{ color: item.status === 'accepted' ? 'blue' : 'inherit' }}
                        >
                          Accept
                        </CButton>

                        <CButton
                          className={item.status === 'rejected' ? 'btn btn-danger' : 'btn btn-secondary'}
                          onClick={() => updateOrderStatus(item.id, 'rejected')}
                        >
                          Reject
                        </CButton>
                        <CButton
                          className="btn btn-danger"
                          onClick={() => deleteOrder(item.id)}
                        >
                          Delete
                        </CButton>
                      </div>
                    </CTableDataCell>

                    </CTableRow>
                ))}
            </CTableBody>
          </CTable>
        </div>
      </div>
    </div>
  );
}
export default OrderPage;
