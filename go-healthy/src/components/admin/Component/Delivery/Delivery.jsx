import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CBadge } from '@coreui/react';
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableRow,
} from '@coreui/react';

function DeliveryPage() {
  const [dataDelivery, setDataDelivery] = useState([]);

  useEffect(() => {
    getDataDelivery();
  }, []);

  const getDataDelivery = async () => {
    try {
      const response = await axios.get('http://localhost:8080/delivery');
      setDataDelivery(response.data.data);
    } catch (error) {
      console.error('Error fetching delivery data:', error);
    }
  };

  const updateStatus = async (id, statusField, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/delivery/update/${id}`, {
        [statusField]: newStatus,
      });

      // Ambil ulang data pengiriman setelah pembaruan
      getDataDelivery();
    } catch (error) {
      console.error(`Error updating ${statusField} status:`, error);
    }
  };

  const handleDeleteDelivery = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/delivery/delete/${id}`);
      // Ambil ulang data pengiriman setelah penghapusan
      getDataDelivery();
      window.alert('Delivery deleted successfully.'); // Tampilkan alert
    } catch (error) {
      console.error('Error deleting delivery:', error);
      window.alert('Failed to delete delivery.'); // Tampilkan alert jika terjadi kesalahan
    }
  };

  // Panggil fungsi pembaruan status untuk setiap status
  const handleUpdatePaymentStatus = (id, newStatus) => {
    updateStatus(id, 'status_pembayaran', newStatus);
  };

  const handleUpdateProcessingStatus = (id, newStatus) => {
    updateStatus(id, 'status_pemrosesan', newStatus);
  };

  const handleUpdateShippingStatus = (id, newStatus) => {
    updateStatus(id, 'status_pengiriman', newStatus);
  };

  const handleUpdateCompletionStatus = (id, newStatus) => {
    updateStatus(id, 'status_selesai', newStatus);
  };

  return (
    <div className="body-flex">
      <div className="flex">
        <div className="col-10 p-5">
          <h2 className="py-2">List Delivery</h2>
          <CTable bordered striped>
            <CTableHead>
              <CTableRow>
                <CTableDataCell>ID Pengiriman</CTableDataCell>
                <CTableDataCell>Nama Pelanggan</CTableDataCell>
                <CTableDataCell>Alamat Pengiriman</CTableDataCell>
                <CTableDataCell>Nomor Handphone</CTableDataCell>
                <CTableDataCell>Item yang Dikirim</CTableDataCell>
                <CTableDataCell>Status Pembayaran</CTableDataCell>
                <CTableDataCell>Status Pemrosesan</CTableDataCell>
                <CTableDataCell>Status Pengiriman</CTableDataCell>
                <CTableDataCell>Status Selesai</CTableDataCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {dataDelivery &&
                dataDelivery.length > 0 &&
                dataDelivery.map((delivery, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{delivery.id_delivery}</CTableDataCell>
                    <CTableDataCell>{delivery.nama_pembeli}</CTableDataCell>
                    <CTableDataCell>{delivery.alamat}</CTableDataCell>
                    <CTableDataCell>{delivery.nomor_handphone}</CTableDataCell>
                    <CTableDataCell>
                      <ul>
                        {delivery.items &&
                          JSON.parse(delivery.items).map((deliveryItems, i) => (
                            <li key={i}>
                              ID: {deliveryItems.id}, Nama: {deliveryItems.title}, Quantity: {deliveryItems.quantity}, Harga: {deliveryItems.price}, Total: {deliveryItems.price * deliveryItems.quantity}
                            </li>
                          ))}
                      </ul>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <span>Status Pembayaran: </span>
                        <CBadge color={delivery.status_pembayaran === 'Lunas' ? 'success' : 'danger'}>
                          {delivery.status_pembayaran}
                        </CBadge>
                        <CButton
                          color="secondary"
                          onClick={() => handleUpdatePaymentStatus(delivery.id_delivery, 'Lunas')}
                        >
                          Lunas
                        </CButton>
                        <CButton
                          color="secondary"
                          onClick={() => handleUpdatePaymentStatus(delivery.id_delivery, 'Belum Lunas')}
                        >
                          Belum Lunas
                        </CButton>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <span>Status Pemrosesan: </span>
                        <CBadge color={delivery.status_pemrosesan === 'Sedang Diproses' ? 'info' : 'warning'}>
                          {delivery.status_pemrosesan}
                        </CBadge>
                        <CButton
                          color="secondary"
                          onClick={() => handleUpdateProcessingStatus(delivery.id_delivery, 'Sedang Diproses')}
                        >
                          Sedang Diproses
                        </CButton>
                        <CButton
                          color="secondary"
                          onClick={() => handleUpdateProcessingStatus(delivery.id_delivery, 'Belum Diproses')}
                        >
                          Belum Diproses
                        </CButton>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <span>Status Pengiriman: </span>
                        <CBadge color={delivery.status_pengiriman === 'Dalam Perjalanan' ? 'warning' : 'success'}>
                          {delivery.status_pengiriman}
                        </CBadge>
                        <CButton
                          color="secondary"
                          onClick={() => handleUpdateShippingStatus(delivery.id_delivery, 'Dalam Perjalanan')}
                        >
                          Dalam Perjalanan
                        </CButton>
                        <CButton
                          color="secondary"
                          onClick={() => handleUpdateShippingStatus(delivery.id_delivery, 'Terkirim')}
                        >
                          Terkirim
                        </CButton>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <span>Status Selesai: </span>
                        <CBadge color={delivery.status_selesai === 'Selesai' ? 'success' : 'danger'}>
                          {delivery.status_selesai}
                        </CBadge>
                        <CButton
                          color="secondary"
                          onClick={() => handleUpdateCompletionStatus(delivery.id_delivery, 'Selesai')}
                        >
                          Selesai
                        </CButton>
                        <CButton
                          color="secondary"
                          onClick={() => handleUpdateCompletionStatus(delivery.id_delivery, 'Belum Selesai')}
                        >
                          Belum Selesai
                        </CButton>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="danger" onClick={() => handleDeleteDelivery(delivery.id_delivery)}>
                        Delete
                      </CButton>
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

export default DeliveryPage;
