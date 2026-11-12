import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../auth/AuthContext';
import { submitOrder } from '../api/backend';

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, updateQty, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const res = await submitOrder({
        userId: user.id,
        customerName: user.displayName,
        address,
        items: cart,
        totalPrice,
      });
      alert(`${res.message}\nรหัสคำสั่งซื้อ: ${res.orderId}\nยอดรวม: ฿${totalPrice}`);
      clearCart();
      setAddress('');
      setIsOpen(false);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการสั่งซื้อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
        <div className="p-4 bg-teal-600 text-white flex justify-between items-center">
          <h2 className="text-lg font-semibold">🛒 ตะกร้าของ {user.displayName}</h2>
          <button onClick={() => setIsOpen(false)} className="text-white hover:text-teal-200 text-2xl leading-none">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-slate-400 py-12">ยังไม่มีสินค้าในตะกร้า</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <h4 className="font-medium text-sm text-slate-900">{item.name}</h4>
                  <p className="text-xs text-teal-700 font-semibold">฿{item.price} x {item.qty} = ฿{item.price * item.qty}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 bg-white border border-slate-300 rounded hover:bg-slate-100">-</button>
                  <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 bg-white border border-slate-300 rounded hover:bg-slate-100">+</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <form onSubmit={handleCheckout} className="p-4 border-t bg-slate-50 space-y-3">
            <div className="text-xs text-slate-600">ผู้รับ: <strong>{user.displayName}</strong></div>
            <textarea required rows="2" placeholder="กรอกที่อยู่จัดส่ง..." value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
            <div className="flex justify-between items-center text-lg font-bold pt-1">
              <span>ยอดรวมทั้งหมด:</span>
              <span className="text-teal-700">฿{totalPrice}</span>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition shadow">
              {loading ? 'กำลังส่งคำสั่งซื้อ...' : 'ยืนยันการสั่งซื้อ'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
