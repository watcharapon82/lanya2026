import React, { useEffect, useState } from 'react';
import { fetchWishlist } from '../api/backend';
import { useAuth } from '../auth/AuthContext';
import MedicineCard from '../components/MedicineCard';

export default function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  const load = () => {
    if (user) fetchWishlist(user.id).then(setItems);
  };

  useEffect(load, [user]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-teal-900 mb-2">❤️ รายการยาประจำตัวของ {user.displayName}</h1>
      <p className="text-slate-500 text-sm mb-6">บันทึกยาที่ใช้บ่อยเพื่อความสะดวกในการสั่งซื้อครั้งถัดไป</p>
      {items.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border text-center text-slate-400">
          ยังไม่มีรายการยาประจำตัว (กดรูปหัวใจที่การ์ดยาเพื่อบันทึก)
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <MedicineCard key={item.id} item={item} isSaved={true} onToggleSave={load} />
          ))}
        </div>
      )}
    </div>
  );
}
