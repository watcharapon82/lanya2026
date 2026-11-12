import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../api/backend';
import { useAuth } from '../auth/AuthContext';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders().then((all) => {
      setOrders(user.role === 'admin' ? all : all.filter((o) => o.userId === user.id));
    });
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-teal-900 mb-6">📦 ประวัติการสั่งซื้อยา</h1>
      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border text-center text-slate-400">ยังไม่มีประวัติคำสั่งซื้อ</div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.orderId} className="bg-white p-5 rounded-xl border shadow-sm">
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <div>
                  <span className="font-bold text-teal-800">{ord.orderId}</span>
                  <span className="text-xs text-slate-500 ml-3">{ord.createdAt}</span>
                </div>
                <span className="font-bold text-lg text-teal-700">฿{ord.totalPrice}</span>
              </div>
              <p className="text-xs text-slate-600 mb-2">ผู้รับ: {ord.customerName} | ที่อยู่: {ord.address}</p>
              <ul className="text-sm text-slate-700 space-y-1">
                {ord.items.map((i) => (
                  <li key={i.id}>• {i.name} x {i.qty} (฿{i.price * i.qty})</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
