import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/backend';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUser(email, password);
      login(res.user, res.token);
      navigate(res.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
    }
  };

  const quickFill = (role) => {
    setEmail(role === 'admin' ? 'admin@medicare.com' : 'member@medicare.com');
    setPassword('123');
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-center text-teal-900 mb-6">เข้าสู่ระบบ MediCare+</h2>
        {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">อีเมล</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3.5 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">รหัสผ่าน</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3.5 py-2 border rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg">
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="mt-6 pt-4 border-t text-xs text-slate-500 space-y-2">
          <p className="font-medium text-slate-700">บัญชีทดสอบด่วน (คลิกเพื่อกรอก):</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => quickFill('member')} className="flex-1 bg-slate-100 hover:bg-slate-200 py-2 rounded font-medium">
              👤 Member (member@medicare.com)
            </button>
            <button type="button" onClick={() => quickFill('admin')} className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-900 py-2 rounded font-medium">
              ⚙️ Admin (admin@medicare.com)
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-600 mt-6">
          ยังไม่มีบัญชี? <Link to="/register" className="text-teal-700 font-semibold hover:underline">สมัครสมาชิก</Link>
        </p>
      </div>
    </div>
  );
}
