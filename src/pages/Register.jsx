import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/backend';
import { useAuth } from '../auth/AuthContext';

export default function Register() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await registerUser(email, password, displayName);
      login(res.user, res.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-center text-teal-900 mb-6">สมัครสมาชิกใหม่</h2>
        {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ชื่อที่แสดง</label>
            <input type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-3.5 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">อีเมล</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3.5 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">รหัสผ่าน</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3.5 py-2 border rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg">
            สมัครสมาชิก
          </button>
        </form>
        <p className="text-center text-sm text-slate-600 mt-6">
          มีบัญชีอยู่แล้ว? <Link to="/login" className="text-teal-700 font-semibold hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}
