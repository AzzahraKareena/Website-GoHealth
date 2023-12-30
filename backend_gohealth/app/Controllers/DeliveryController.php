<?php

namespace App\Controllers;

use App\Models\DeliveryModel;
use CodeIgniter\RESTful\ResourceController;

class DeliveryController extends ResourceController
{
    public function index()
    {
        $session = session();
        $userId = $session->get('user_id');

        $deliveryModel = new DeliveryModel();
        $deliveries = $deliveryModel->where('id_user', $userId)->findAll();

        return $this->respond(['status' => 'success', 'data' => $deliveries]);
    }

    public function create()
    {
        $deliveryModel = new DeliveryModel();

        $items = $this->request->getPost('items');

        if (!isset($items)) {
            return $this->respond(['status' => 'error', 'message' => 'Item is not defined']);
        }

        $userId = session()->get('user_id');

        $data = [
            'id_user' => $userId,
            'id_order' => $this->request->getPost('id_order'),
            'nama_pembeli' => $this->request->getPost('nama_pembeli'),
            'alamat' => $this->request->getPost('alamat'),
            'nomor_handphone' => $this->request->getPost('nomor_handphone'),
            'items' => $items,
            'status_pembayaran' => 'belum berhasil', // Set default status
            'status_pemrosesan' => 'belum diproses', // Set default status
            'status_pengiriman' => 'belum dikirim', // Set default status
            'status_selesai' => 'belum selesai', // Set default status
        ];
        
        $deliveryModel->insert($data);
        

        return $this->respondCreated(['status' => 'success', 'message' => 'Shipment created successfully']);
    }

    public function delete($id = null)
    {
        $deliveryModel = new DeliveryModel();
        $delivery = $deliveryModel->find($id);

        if (!$delivery) {
            return $this->failNotFound('Shipment not found');
        }

        $deliveryModel->delete($id);

        return $this->respond(['status' => 'success', 'message' => 'Shipment deleted successfully']);
    }

    public function updateStatus($idDelivery = null)
{
    $statusPembayaran = $this->request->getVar('status_pembayaran');
    $statusPemrosesan = $this->request->getVar('status_pemrosesan');
    $statusPengiriman = $this->request->getVar('status_pengiriman');
    $statusSelesai = $this->request->getVar('status_selesai');

    $deliveryModel = new DeliveryModel();

    // Ganti 'id' dengan kolom yang sesuai di tabel Anda
    $delivery = $deliveryModel->where('id_delivery', $idDelivery)->first();

    if ($delivery) {
        // Update status pembayaran jika diberikan
        $statusPembayaran = $statusPembayaran !== null ? $statusPembayaran : $delivery['status_pembayaran'];

        // Update status pemrosesan jika diberikan
        $statusPemrosesan = $statusPemrosesan !== null ? $statusPemrosesan : $delivery['status_pemrosesan'];

        // Update status pengiriman jika diberikan
        $statusPengiriman = $statusPengiriman !== null ? $statusPengiriman : $delivery['status_pengiriman'];

        // Update status selesai jika diberikan
        $statusSelesai = $statusSelesai !== null ? $statusSelesai : $delivery['status_selesai'];

        $deliveryModel->update($delivery['id_delivery'], [
            'status_pembayaran' => $statusPembayaran,
            'status_pemrosesan' => $statusPemrosesan,
            'status_pengiriman' => $statusPengiriman,
            'status_selesai' => $statusSelesai,
        ]);

        $response = [
            'status' => 'success',
            'message' => 'Status delivery berhasil diperbarui',
            'data' => [
                'id_order' => $idDelivery,
                'status_pembayaran' => $statusPembayaran,
                'status_pemrosesan' => $statusPemrosesan,
                'status_pengiriman' => $statusPengiriman,
                'status_selesai' => $statusSelesai,
            ],
        ];

        return $this->respond($response);
    } else {
        $response = [
            'status' => 'error',
            'message' => 'Delivery data not found',
            'data' => [],
        ];

        return $this->failNotFound('Delivery data not found');
    }
}
}