# Hướng Dẫn Triển Khai (Deployment Guide) - Đồng Tâm Feed Website

Dự án gồm 2 phần chính:
- **Frontend**: React (Vite)
- **Backend**: Node.js + Express API (Lưu dữ liệu file JSON + lưu trữ ảnh upload)

---

## CÁCH 1: Triển khai trên VPS (Ubuntu Server) - KHUYÊN DÙNG TỐT NHẤT

Đây là phương pháp tối ưu nhất cho website có upload hình ảnh và lưu trữ file dữ liệu cục bộ.

### Bước 1: Chuẩn bị máy chủ VPS
1. Đăng nhập vào VPS qua SSH:
   ```bash
   ssh root@<IP_VPS>
   ```
2. Cài đặt Node.js, Git, Nginx và PM2:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs git nginx
   sudo npm install -g pm2
   ```

### Bước 2: Clone dự án từ GitHub
```bash
cd /var/www
git clone https://github.com/luongtai727/dongtam_feed.git
cd dongtam_feed
```

### Bước 3: Build Frontend & Chạy Backend
1. **Chạy Backend API**:
   ```bash
   cd /var/www/dongtam_feed/backend
   npm install
   pm2 start server.js --name "dongtam-api"
   pm2 save
   pm2 startup
   ```
2. **Build Frontend**:
   ```bash
   cd /var/www/dongtam_feed/frontend
   npm install
   npm run build
   ```
   *(Thư mục `frontend/dist` chứa toàn bộ code giao diện đã build)*

### Bước 4: Cấu hình Nginx
Tạo file cấu hình web server Nginx:
```bash
sudo nano /etc/nginx/sites-available/dongtamfeed
```
Dán nội dung cấu hình sau (thay `yourdomain.com` thành tên miền của bạn):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (React App)
    location / {
        root /var/www/dongtam_feed/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API & Uploads
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        proxy_pass http://localhost:5000/uploads/;
    }
}
```
Kích hoạt trang web & khởi động lại Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/dongtamfeed /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Bước 5: Cài đặt SSL Miễn phí (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## CÁCH 2: Triển khai trên Cloud (Vercel + Render / Railway)

### 1. Backend (Render / Railway / Render.com)
- Tải repo lên Render/Railway.
- Thư mục chạy: `backend`
- Lệnh khởi chạy (Start Command): `node server.js`
- ⚠️ **Lưu ý quan trọng**: Thêm **Persistent Volume (Ổ đĩa lưu trữ cố định)** cho thư mục `/uploads` và `/data` để tránh bị mất hình ảnh & thông tin khi server restart.

### 2. Frontend (Vercel / Netlify)
- Đăng nhập Vercel.com -> Import repo GitHub `luongtai727/dongtam_feed`.
- Thư mục gốc (Root Directory): `frontend`
- Cấu hình Environment Variable (Biến môi trường):
  - `VITE_API_URL`: URL API Backend của bạn (Ví dụ: `https://api.dongtamfeed.vn`)
- Bấm **Deploy**.

---

## CẬP NHẬT WEBSITE KHI CÓ CODE MỚI
Mỗi khi bạn đẩy code mới lên GitHub, trên VPS bạn chỉ cần chạy 3 lệnh đơn giản sau:
```bash
cd /var/www/dongtam_feed
git pull origin main
cd frontend && npm run build
pm2 restart dongtam-api
```
