import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMedicineById } from '../api/backend';
import { useCart } from '../context/CartContext';

export default function MedicineDetail() {
  const { id } = useParams();
  const { addToCart, setIsOpen } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedicineById(id)
      .then((data) => setItem(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-16">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="text-center py-16 text-red-600">{error}</div>;
  if (!item) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/" className="text-teal-700 hover:underline text-sm mb-6 inline-block">&larr; กลับไปหน้ารายการยาทั้งหมด</Link>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-4xl">{item.icon}</div>
          <div>
            <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">{item.category}</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{item.name}</h1>
          </div>
        </div>
        <div className="space-y-4 text-slate-700 text-sm md:text-base">
          <div>
            <h3 className="font-semibold text-slate-900">สรรพคุณและวิธีใช้:</h3>
            <p className="mt-1">{item.desc}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-900 text-sm">
            <strong>⚠️ ข้อควรระวัง:</strong> {item.warning}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">ราคาต่อชิ้น</span>
            <span className="text-2xl font-bold text-teal-700">฿{item.price}</span>
          </div>
          <button onClick={() => { addToCart(item); setIsOpen(true); }} className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-lg transition shadow">
            + เพิ่มลงตะกร้าสินค้า
          </button>
        </div>
      </div>
    </div>
  );
}
