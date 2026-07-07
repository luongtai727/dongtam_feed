# Đồng Tâm Feed Solutions

Website giới thiệu công ty & sản phẩm nguyên liệu thức ăn chăn nuôi.

## Tech Stack

- **Frontend**: React (Vite) + React Router
- **Backend**: Express.js + JSON file storage
- **Auth**: JWT + bcrypt

## Cài đặt

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Chỉnh sửa JWT_SECRET
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tài khoản Admin
- Username: `admin`
- Password: `admin123`
- URL: `http://localhost:3000/admin`

## Tính năng
- 🏠 Trang chủ với hero section, sản phẩm nổi bật, tin tức
- 📦 Quản lý sản phẩm (CRUD + hình ảnh)
- 📰 Quản lý tin tức (CRUD + hình ảnh)
- 🏷️ Quản lý danh mục (sản phẩm & tin tức)
- 📬 Form liên hệ + quản lý liên hệ
- ⚙️ Cài đặt website
- 🌙 Dark/Light mode
- 📱 Responsive design

## License
© 2026 Đồng Tâm Feed Solutions
