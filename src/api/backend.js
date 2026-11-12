const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาดในการเชื่อมต่อ API');
  return data;
}

export const loginUser = (email, password) =>
  apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const registerUser = (email, password, displayName) =>
  apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, displayName }) });

export const fetchMedicines = () => apiFetch('/api/medicines');
export const fetchMedicineById = (id) => apiFetch(`/api/medicines/${id}`);
export const createMedicine = (payload) => apiFetch('/api/medicines', { method: 'POST', body: JSON.stringify(payload) });
export const deleteMedicine = (id) => apiFetch(`/api/medicines/${id}`, { method: 'DELETE' });

export const fetchWishlist = (userId) => apiFetch(`/api/wishlist/${userId}`);
export const toggleWishlist = (userId, medicineId) =>
  apiFetch(`/api/wishlist/${userId}`, { method: 'POST', body: JSON.stringify({ medicineId }) });

export const fetchOrders = () => apiFetch('/api/orders');
export const submitOrder = (payload) => apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(payload) });
export const fetchMembers = () => apiFetch('/api/admin/members');
