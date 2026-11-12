import React, { useEffect, useState } from 'react';
import { fetchMedicines, createMedicine, deleteMedicine, fetchMembers, fetchOrders } from '../../api/backend';

export default function AdminDashboard() {
  const [medicines, setMedicines] = useState([]);
  const [members, setMembers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', category: 'ยาสามัญประจำบ้าน', price: '', stock: '', desc: '', warning: '', icon: '💊' });

  const loadAll = () => {
    fetchMedicines().then(setMedicines);
    fetchMembers().then(setMembers);
    fetchOrders().then(setOrders);
  };

  useEffect(loadAll, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await createMedicine(form);
    setForm({ name: '', category: 'ยาสามัญประจำบ้าน', price: '', stock: '', desc: '', warning: '', icon: '💊' });
    loadAll();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันการลบรายการยานี้?')) return;
    await deleteMedicine(id);
    loadAll();
  };

  const totalSales = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">⚙️ ระบบจัดการหลังบ้าน (Admin Dashboard)</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="text-sm text-slate-500">รายการยาทั้งหมด</div>
          <div className="text-3xl font-bold text-teal-700 mt-1">{medicines.length} รายการ</div>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="text-sm text-slate-500">จำนวนสมาชิกในระบบ</div>
          <div className="text-3xl font-bold text-blue-700 mt-1">{members.length} คน</div>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="text-sm text-slate-500">ยอดขายรวม ({orders.length} ออเดอร์)</div>
          <div className="text-3xl font-bold text-amber-600 mt-1">฿{totalSales}</div>
        </div>
      </div>

      {/* Add Medicine Form */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-lg font-bold mb-4">+ เพิ่มรายการยาใหม่</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" required placeholder="ชื่อยา" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white">
            <option value="ยาสามัญประจำบ้าน">ยาสามัญประจำบ้าน</option>
            <option value="วิตามินและอาหารเสริม">วิตามินและอาหารเสริม</option>
            <option value="เวชภัณฑ์และทำแผล">เวชภัณฑ์และทำแผล</option>
          </select>
          <div className="flex gap-2">
            <input type="number" required placeholder="ราคา (บาท)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-1/2 px-3 py-2 border rounded-lg text-sm" />
            <input type="number" required placeholder="สต็อก (ชิ้น)" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-1/2 px-3 py-2 border rounded-lg text-sm" />
          </div>
          <input type="text" required placeholder="สรรพคุณ" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
          <input type="text" placeholder="คำเตือนการใช้ยา" value={form.warning} onChange={(e) => setForm({ ...form, warning: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
          <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg text-sm">
            บันทึกยาเข้าสต็อก
          </button>
        </form>
      </div>

      {/* Manage Medicines Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <div className="p-4 border-b font-bold">จัดการคลังยา ({medicines.length})</div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3">ชื่อยา</th>
              <th className="p-3">หมวดหมู่</th>
              <th className="p-3">ราคา</th>
              <th className="p-3">คงเหลือ</th>
              <th className="p-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {medicines.map((m) => (
              <tr key={m.id}>
                <td className="p-3 font-medium">{m.icon} {m.name}</td>
                <td className="p-3">{m.category}</td>
                <td className="p-3">฿{m.price}</td>
                <td className="p-3">{m.stock} ชิ้น</td>
                <td className="p-3 text-right">
                  <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:underline text-xs font-medium">
                    ลบรายการ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <div className="p-4 border-b font-bold">รายชื่อสมาชิกในระบบ ({members.length})</div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">ชื่อแสดง</th>
              <th className="p-3">อีเมล</th>
              <th className="p-3">สิทธิ์ (Role)</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {members.map((u) => (
              <tr key={u.id}>
                <td className="p-3">{u.id}</td>
                <td className="p-3 font-medium">{u.displayName}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'}`}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
