import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../auth/AuthContext';
import { toggleWishlist } from '../api/backend';

export default function MedicineCard({ item, isSaved = false, onToggleSave }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBuy = () => {
    if (!user) {
      alert('กรุณาเข้าสู่ระบบ (Member) ก่อนสั่งซื้อยาครับ');
      navigate('/login');
      return;
    }
    addToCart(item);
  };

  const handleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await toggleWishlist(user.id, item.id);
    if (onToggleSave) onToggleSave(item.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition relative">
      {user && (
        <button
          onClick={handleWishlist}
          title="บันทึกเป็นยาประจำตัว"
          className="absolute top-4 right-4 text-xl hover:scale-110 transition"
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
      )}
      <div>
        <Link to={`/medicines/${item.id}`} className="block group">
          <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition">
            {item.icon}
          </div>
          <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
            {item.category}
          </span>
          <h3 className="font-semibold text-base text-slate-900 mt-2 group-hover:text-teal-700">
            {item.name}
          </h3>
        </Link>
        <p className="text-slate-500 text-xs mt-1 line-clamp-2">{item.desc}</p>
      </div>
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="font-bold text-lg text-teal-700">฿{item.price}</span>
          <span className="block text-[11px] text-slate-400">คงเหลือ {item.stock} ชิ้น</span>
        </div>
        <button
          onClick={handleBuy}
          className="bg-teal-600 hover:bg-teal-700 text-white text-sm px-3.5 py-1.5 rounded-lg transition"
        >
          {user ? '+ ใส่ตะกร้า' : '🔒 เข้าสู่ระบบเพื่อซื้อ'}
        </button>
      </div>
    </div>
  );
}
