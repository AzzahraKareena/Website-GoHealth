<?php

namespace App\Controllers;

use App\Models\OrderModel;
use App\Models\DeliveryModel;
use CodeIgniter\RESTful\ResourceController;

class OrdersController extends ResourceController
{
    public function createOrder()
    {
        // Handle OPTIONS request
        if ($this->request->getMethod() === 'options') {
            return $this->response->setStatusCode(200);
        }

        // Validation rules
        $rules = [
            'name' => 'required',
            'phone' => 'required',
            'address' => 'required',
            'paymentMethod' => 'required',
            'items' => 'required',
            'totalAmount' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }

        // Prepare data for insertion into OrderModel
        $data = [
            'name' => $this->request->getVar('name'),
            'phone' => $this->request->getVar('phone'),
            'address' => $this->request->getVar('address'),
            'paymentMethod' => $this->request->getVar('paymentMethod'),
            'items' => $this->request->getVar('items'),
            'totalAmount' => $this->request->getVar('totalAmount'),
            'status' => 'pending'
        ];

        // Insert data into OrderModel
        $orderModel = new OrderModel();
        $orderId = $orderModel->insert($data);

        // Prepare data for insertion into ShipmentModel
        $deliveryData = [
            'id_order' => $orderId,
            'nama_pembeli' => $this->request->getVar('name'),
            'alamat' => $this->request->getVar('address'),
            'nomor_handphone' => $this->request->getVar('phone'),
            'items' => $this->request->getVar('items'), // Gunakan langsung tanpa decoding
            'status_pembayaran' => 'belum berhasil', // Set default status
            'status_pemrosesan' => 'belum diproses', // Set default status
            'status_pengiriman' => 'belum dikirim', // Set default status
            'status_selesai' => 'belum selesai', // Set default status
        ];

        // Insert data into ShipmentModel
        $deliveryModel = new DeliveryModel();
        $deliveryModel->insert($deliveryData);

        // Response for successful order creation
        $response = [
            'status' => 201,
            'error' => null,
            'messages' => [
                'success' => 'Order Created'
            ],
            'data' => ['id' => $orderId]
        ];

        return $this->respondCreated($response);
    }

    public function index()
    {
        $orderModel = new OrderModel();
        $orders = $orderModel->findAll();

        $orderCount = count($orders);

        if (!empty($orders)) {
            $response = [
                'status' => 'success',
                'message' => 'Data retrieved successfully',
                'total_orders' => $orderCount,
                'data' => $orders
            ];
        } else {
            $response = [
                'status' => 'error',
                'message' => 'No data found',
                'total_orders' => 0,
                'data' => []
            ];
        }

        return $this->respond($response);
    }

    public function delete($id = null)
    {
        $orderModel = new OrderModel();
        $order = $orderModel->find($id);

        if ($order) {
            $orderModel->delete($id);

            $response = [
                'status' => 'success',
                'message' => 'Order deleted successfully',
                'data' => $order
            ];

            return $this->respondDeleted($response);
        } else {
            $response = [
                'status' => 'error',
                'message' => 'Order not found',
                'data' => []
            ];

            return $this->failNotFound('Order not found');
        }
    }

    public function updateStatus($id = null)
    {
        $status = $this->request->getVar('status');
    
        // Validasi status, pastikan hanya 'accepted' atau 'rejected'
        if (!in_array($status, ['accepted', 'rejected'])) {
            return $this->failValidationError('Status tidak valid. Gunakan "accepted" atau "rejected".');
        }
    
        $orderModel = new OrderModel();
        $order = $orderModel->find($id);
    
        if ($order) {
            // Perbarui status di OrderModel
            $builder = $orderModel->builder();
            $builder->set('status', $status);
            $builder->where('id', $id);
            $builder->update();
    
            // Perbarui status di ShipmentModel
            $deliveryModel = new DeliveryModel();
            $builder = $deliveryModel->builder();
            $builder->set('status_pemrosesan', $status == 'accepted');
            $builder->where('id_order', $id);
            $builder->update();
    
            $response = [
                'status' => 'success',
                'message' => 'Status pesanan berhasil diperbarui',
                'data' => ['id' => $id, 'status' => $status]
            ];
    
            return $this->respond($response);
        } else {
            $response = [
                'status' => 'error',
                'message' => 'Pesanan tidak ditemukan',
                'data' => []
            ];
    
            return $this->failNotFound('Pesanan tidak ditemukan');
        }
    }
}    