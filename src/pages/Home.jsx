import React, { useEffect, useState } from 'react';
import { fetchMedicines, fetchWishlist } from '../api/backend';
import { useAuth } from '../auth/AuthContext';
import MedicineCard from '../components/MedicineCard';

export default function Home() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines().then(setMedicines).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      fetchWishlist(user.id).then((list) => setSavedIds(list.map((m) => m.id)));
    } else {
      setSavedIds([]);
    }
  }, [user]);

  const handleToggleSave = (medId) => {
    setSavedIds((prev) => (prev.includes(medId) ? prev.filter((id) => id !== medId) : [...prev, medId]));
  };

  const filtered = medicines.filter((p) => {
    const matchText = p.name.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase());
    const matchCat = category === 'all' || p.category === category;
    return matchText && matchCat;
  });

  return (
    <div>
      <header className="bg-teal-50 border-b border-teal-100 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-teal-900 mb-2">ร้านขายยาและเวชภัณฑ์ใกล้บ้านคุณ</h1>
          <p className="text-slate-600 text-sm md:text-base mb-6">
            {user ? `ยินดีต้อนรับ ${user.displayName} เลือกซื้อยาและบันทึกยาประจำตัวได้เลย` : 'เข้าชมรายการยาได้ทันที หรือเข้าสู่ระบบเพื่อสั่งซื้อและบันทึกยาประจำตัว'}
          </p>
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหาชื่อยา หรืออาการ เช่น ปวดหัว, ไข้, วิตามิน..." className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="all">ทุกหมวดหมู่</option>
              <option value="ยาสามัญประจำบ้าน">ยาสามัญประจำบ้าน</option>
              <option value="วิตามินและอาหารเสริม">วิตามินและอาหารเสริม</option>
              <option value="เวชภัณฑ์และทำแผล">เวชภัณฑ์และทำแผล</option>
            </select>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12 text-slate-500">กำลังโหลดรายการยา...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <MedicineCard
                key={item.id}
                item={item}
                isSaved={savedIds.includes(item.id)}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
