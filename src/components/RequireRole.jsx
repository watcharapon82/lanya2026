import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function RequireRole({ role, children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    return (
      <div className="max-w-lg mx-auto mt-16 p-6 bg-red-50 border border-red-200 rounded-xl text-center text-red-700">
        <h2 className="text-xl font-bold mb-2">⛔ ไม่มีสิทธิ์เข้าถึงหน้านี้</h2>
        <p className="text-sm">หน้านี้สงวนสิทธิ์เฉพาะผู้ดูแลระบบ ({role}) เท่านั้น</p>
      </div>
    );
  }
  return children;
}
