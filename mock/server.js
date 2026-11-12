const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4000;
const dataPath = path.join(__dirname, 'medicines.json');

let users = [
  { id: 1, email: 'admin@medicare.com', password: '123', displayName: 'ภก.สมชาย (Admin)', role: 'admin' },
  { id: 2, email: 'member@medicare.com', password: '123', displayName: 'คุณวิภา (Member)', role: 'member' }
];
let orders = [];
let wishlists = { 2: [1, 5] };

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const readMedicines = () => JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const writeMedicines = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  const parseBody = () => new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
  });

  const sendJson = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
  };

  // Auth: Login & Register
  if (req.url === '/api/auth/login' && req.method === 'POST') {
    return parseBody().then(({ email, password }) => {
      const user = users.find((u) => u.email === email && u.password === password);
      if (!user) return sendJson(401, { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
      const { password: _, ...safeUser } = user;
      sendJson(200, { token: 'mock-jwt-' + user.id, user: safeUser });
    });
  }

  if (req.url === '/api/auth/register' && req.method === 'POST') {
    return parseBody().then(({ email, password, displayName }) => {
      if (users.some((u) => u.email === email)) return sendJson(400, { error: 'อีเมลนี้ถูกใช้งานแล้ว' });
      const newUser = { id: Date.now(), email, password, displayName: displayName || email.split('@')[0], role: 'member' };
      users.push(newUser);
      const { password: _, ...safeUser } = newUser;
      sendJson(201, { token: 'mock-jwt-' + newUser.id, user: safeUser });
    });
  }

  // Medicines CRUD
  if (req.url === '/api/medicines' && req.method === 'GET') {
    return sendJson(200, readMedicines());
  }

  if (req.url === '/api/medicines' && req.method === 'POST') {
    return parseBody().then((body) => {
      const list = readMedicines();
      const newMed = {
        id: Date.now(),
        name: body.name,
        category: body.category || 'ยาสามัญประจำบ้าน',
        price: Number(body.price) || 0,
        stock: Number(body.stock) || 10,
        desc: body.desc || '',
        warning: body.warning || 'โปรดอ่านฉลากก่อนใช้ยา',
        icon: body.icon || '💊'
      };
      list.push(newMed);
      writeMedicines(list);
      sendJson(201, newMed);
    });
  }

  const medIdMatch = req.url.match(/^\/api\/medicines\/(\d+)$/);
  if (medIdMatch) {
    const id = Number(medIdMatch[1]);
    if (req.method === 'GET') {
      const item = readMedicines().find((m) => m.id === id);
      return item ? sendJson(200, item) : sendJson(404, { error: 'ไม่พบข้อมูลยา' });
    }
    if (req.method === 'DELETE') {
      const list = readMedicines().filter((m) => m.id !== id);
      writeMedicines(list);
      return sendJson(200, { message: 'ลบรายการยาเรียบร้อย' });
    }
  }

  // Wishlist (Member)
  const wishMatch = req.url.match(/^\/api\/wishlist\/(\d+)$/);
  if (wishMatch) {
    const userId = Number(wishMatch[1]);
    if (req.method === 'GET') {
      const ids = wishlists[userId] || [];
      const meds = readMedicines().filter((m) => ids.includes(m.id));
      return sendJson(200, meds);
    }
    if (req.method === 'POST') {
      return parseBody().then(({ medicineId }) => {
        const ids = wishlists[userId] || [];
        wishlists[userId] = ids.includes(medicineId)
          ? ids.filter((i) => i !== medicineId)
          : [...ids, medicineId];
        sendJson(200, { wishlistIds: wishlists[userId] });
      });
    }
  }

  // Orders
  if (req.url === '/api/orders' && req.method === 'GET') {
    return sendJson(200, orders);
  }

  if (req.url === '/api/orders' && req.method === 'POST') {
    return parseBody().then((order) => {
      const newOrder = { orderId: 'ORD-' + Date.now(), createdAt: new Date().toLocaleString('th-TH'), ...order };
      orders.unshift(newOrder);
      sendJson(201, { message: 'บันทึกคำสั่งซื้อสำเร็จ', ...newOrder });
    });
  }

  // Admin: Members list
  if (req.url === '/api/admin/members' && req.method === 'GET') {
    return sendJson(200, users.map(({ password, ...u }) => u));
  }

  sendJson(404, { error: 'Not Found' });
});

server.listen(PORT, () => console.log(`Mock Pharmacy API running at http://localhost:${PORT}`));
