# Laptop Shop API - Postman Collection

## 📋 Tổng quan

Bộ collection Postman này bao gồm tất cả các API endpoints của Laptop Shop backend để testing và development.

## 🚀 Cài đặt

### 1. Import Collection
1. Mở Postman
2. Click **Import** 
3. Chọn file `Laptop-Shop-API.postman_collection.json`
4. Click **Import**

### 2. Import Environment
1. Click **Import** 
2. Chọn file `Laptop-Shop-Environment.postman_environment.json`
3. Click **Import**
4. Chọn environment **"Laptop Shop Environment"** ở góc trên bên phải

## 🔧 Cấu hình

### Environment Variables
- **base_url**: `http://localhost:8080` (API server URL)
- **jwt_token**: JWT token từ login (sẽ được set tự động)
- **user_id**: ID của user hiện tại
- **product_id**: ID của product để test
- **order_id**: ID của order để test

## 📚 API Endpoints

### 🔐 Authentication
- **POST** `/api/v1/auth/register` - Đăng ký user mới
- **POST** `/api/v1/auth/login` - Đăng nhập và lấy JWT token
- **GET** `/api/v1/auth/profile` - Lấy thông tin user (cần auth)
- **PUT** `/api/v1/auth/profile` - Cập nhật thông tin user (cần auth)

### 🧪 Test Endpoints
- **POST** `/api/v1/test` - Test endpoint công khai

### 📦 Products
- **GET** `/api/products` - Lấy danh sách sản phẩm (cần auth)
- **GET** `/api/products/{id}` - Lấy sản phẩm theo ID (cần auth)
- **POST** `/api/products` - Tạo sản phẩm mới (cần ADMIN)
- **PUT** `/api/products/{id}` - Cập nhật sản phẩm (cần ADMIN)
- **DELETE** `/api/products/{id}` - Xóa sản phẩm (cần ADMIN)

### 🛒 Orders
- **POST** `/api/orders` - Tạo đơn hàng mới (cần auth)
- **GET** `/api/orders/my-orders` - Lấy đơn hàng của user (cần auth)
- **GET** `/api/orders/{id}` - Lấy đơn hàng theo ID (cần auth)

### 👑 Admin Endpoints
- **GET** `/api/admin/users` - Lấy danh sách users (cần ADMIN)
- **GET** `/api/admin/orders` - Lấy tất cả đơn hàng (cần ADMIN)
- **PUT** `/api/admin/orders/{id}/status` - Cập nhật trạng thái đơn hàng (cần ADMIN)

### 📖 Documentation
- **GET** `/swagger-ui.html` - Swagger UI
- **GET** `/v3/api-docs` - API docs JSON

## 🔄 Workflow Testing

### 1. Test Authentication Flow
1. **Register User** - Tạo user mới
2. **Login User** - Đăng nhập và lưu JWT token
3. **Get Profile** - Kiểm tra thông tin user

### 2. Test Product Management (Admin)
1. **Login as Admin** - Đăng nhập với role ADMIN
2. **Create Product** - Tạo sản phẩm mới
3. **Get All Products** - Lấy danh sách sản phẩm
4. **Update Product** - Cập nhật sản phẩm
5. **Delete Product** - Xóa sản phẩm

### 3. Test Order Flow
1. **Login User** - Đăng nhập user thường
2. **Get Products** - Lấy danh sách sản phẩm
3. **Create Order** - Tạo đơn hàng
4. **Get My Orders** - Xem đơn hàng của user

## 🛠️ Tips & Tricks

### Auto-save JWT Token
Sau khi login thành công, JWT token sẽ được tự động lưu vào environment variable `jwt_token`.

### Test Data
- Sử dụng dữ liệu test có sẵn trong collection
- Thay đổi `product_id`, `order_id` trong environment khi cần

### Error Handling
- Kiểm tra response status code
- Đọc error message trong response body
- Đảm bảo server đang chạy trên port 8080

## 🐛 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Kiểm tra server có đang chạy không
   - Đảm bảo port 8080 không bị chiếm dụng

2. **401 Unauthorized**
   - Kiểm tra JWT token có hợp lệ không
   - Thử login lại để lấy token mới

3. **403 Forbidden**
   - Kiểm tra user có đủ quyền (ADMIN) không
   - Đăng nhập với tài khoản admin

4. **CORS Error**
   - Chỉ xảy ra khi test từ browser
   - Postman không bị ảnh hưởng bởi CORS

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Server logs
2. Postman console
3. Network tab trong browser (nếu test từ frontend)
