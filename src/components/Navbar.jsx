import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { totalQty, setIsOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-teal-600 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-wrap justify-between items-center gap-3">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">💊</span>
          <span className="font-bold text-xl tracking-wide">MediCare+</span>
        </Link>

        <div className="flex items-center space-x-4 text-sm font-medium">
          <Link to="/" className="hover:text-teal-200">รายการยา</Link>

          {user ? (
            <>
              <Link to="/wishlist" className="hover:text-teal-200">❤️ ยาประจำตัว</Link>
              <Link to="/orders" className="hover:text-teal-200">📦 ประวัติสั่งซื้อ</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="bg-amber-400 text-teal-950 px-3 py-1 rounded-md font-semibold hover:bg-amber-300">
                  ⚙️ ระบบหลังบ้าน (Admin)
                </Link>
              )}
              <span className="text-teal-100 border-l border-teal-500 pl-3">
                👤 {user.displayName} ({user.role})
              </span>
              <button onClick={handleLogout} className="text-xs bg-teal-800 hover:bg-teal-900 px-2.5 py-1 rounded">
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <span className="text-xs bg-teal-700 px-2.5 py-1 rounded-full text-teal-100">โหมดผู้เยี่ยมชม (Guest)</span>
              <Link to="/login" className="hover:text-teal-200">เข้าสู่ระบบ</Link>
              <Link to="/register" className="bg-white text-teal-700 px-3 py-1 rounded-md font-semibold hover:bg-teal-50">
                สมัครสมาชิก
              </Link>
            </>
          )}

          <button
            onClick={() => (user ? setIsOpen(true) : navigate('/login'))}
            className="bg-teal-700 hover:bg-teal-800 px-3.5 py-1.5 rounded-lg flex items-center space-x-2 transition"
          >
            <span>🛒 ตะกร้า</span>
            <span className="bg-amber-400 text-teal-950 font-bold text-xs px-2 py-0.5 rounded-full">{totalQty}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
