# Cart Features Demo Guide

## Hướng dẫn test tính năng giỏ hàng

### 1. Chuẩn bị
1. Đảm bảo API server đang chạy trên port 8888
2. Đảm bảo có dữ liệu sản phẩm trong database
3. Mở ứng dụng React trên port 3000

### 2. Test các tính năng cơ bản

#### 2.1. Thêm sản phẩm vào giỏ hàng
1. Truy cập trang chủ (`/`)
2. Trong phần "Featured Products", click nút "Add to Cart" trên bất kỳ sản phẩm nào
3. Kiểm tra:
   - Badge số lượng trên icon giỏ hàng tăng lên
   - Message "Product added to cart!" xuất hiện
   - Sản phẩm được lưu vào localStorage

#### 2.2. Xem giỏ hàng
1. Click vào icon giỏ hàng trên navbar
2. Kiểm tra:
   - Trang giỏ hàng hiển thị sản phẩm đã thêm
   - Thông tin sản phẩm: tên, giá, hình ảnh, số lượng
   - Tổng giá tiền được tính chính xác

#### 2.3. Cập nhật số lượng
1. Trong trang giỏ hàng, thay đổi số lượng bằng InputNumber
2. Kiểm tra:
   - Tổng giá tiền cập nhật real-time
   - Badge số lượng trên navbar cập nhật
   - Dữ liệu được lưu vào localStorage

#### 2.4. Xóa sản phẩm
1. Click nút "Remove" bên cạnh sản phẩm
2. Kiểm tra:
   - Sản phẩm biến mất khỏi giỏ hàng
   - Tổng giá tiền cập nhật
   - Badge số lượng giảm
   - Message "Item removed from cart"

#### 2.5. Xóa toàn bộ giỏ hàng
1. Click nút "Clear Cart"
2. Kiểm tra:
   - Giỏ hàng trống
   - Hiển thị Empty state
   - Badge số lượng = 0

### 3. Test tính năng nâng cao

#### 3.1. Tìm kiếm và lọc sản phẩm
1. Truy cập trang Products (`/products`)
2. Test tìm kiếm:
   - Nhập tên sản phẩm vào search box
   - Kiểm tra kết quả lọc
3. Test lọc theo danh mục:
   - Chọn category từ dropdown
   - Kiểm tra sản phẩm được lọc
4. Test sắp xếp:
   - Chọn sort option
   - Kiểm tra sản phẩm được sắp xếp

#### 3.2. Chi tiết sản phẩm
1. Click vào sản phẩm bất kỳ
2. Kiểm tra:
   - Thông tin sản phẩm đầy đủ
   - Hình ảnh, giá, mô tả
   - Input số lượng và nút "Add to Cart"
3. Test thêm vào giỏ từ trang chi tiết:
   - Chọn số lượng
   - Click "Add to Cart"
   - Kiểm tra sản phẩm được thêm vào giỏ

#### 3.3. Checkout process
1. Có sản phẩm trong giỏ hàng
2. Click "Proceed to Checkout"
3. Điền form thông tin giao hàng:
   - First Name, Last Name
   - Phone Number
   - Address, City, State, ZIP
4. Kiểm tra:
   - Form validation hoạt động
   - Order summary hiển thị đúng
   - Tổng giá tiền chính xác
5. Click "Place Order"
6. Kiểm tra:
   - Order được tạo thành công
   - Giỏ hàng được xóa
   - Chuyển đến trang orders

### 4. Test với user đã đăng nhập

#### 4.1. Đăng nhập
1. Click "Login" trên navbar
2. Đăng nhập với tài khoản có sẵn
3. Kiểm tra:
   - User menu xuất hiện
   - Cart vẫn giữ nguyên (nếu có)

#### 4.2. Sync với server
1. Thêm sản phẩm vào giỏ khi đã đăng nhập
2. Kiểm tra:
   - Dữ liệu được sync với server
   - Refresh trang, giỏ hàng vẫn giữ nguyên
3. Logout và login lại:
   - Giỏ hàng từ server được load về

### 5. Test responsive design

#### 5.1. Mobile view
1. Mở DevTools, chuyển sang mobile view
2. Test các trang:
   - Homepage: Featured products grid
   - Products: Search và filter
   - Cart: Table responsive
   - Checkout: Form layout
3. Kiểm tra:
   - Layout không bị vỡ
   - Buttons và inputs dễ sử dụng
   - Navigation hoạt động tốt

#### 5.2. Tablet view
1. Test với tablet breakpoint
2. Kiểm tra:
   - Grid layout phù hợp
   - Spacing và padding hợp lý

### 6. Test edge cases

#### 6.1. Empty states
1. Giỏ hàng trống:
   - Hiển thị Empty component
   - Có nút "Continue Shopping"
2. Không có sản phẩm:
   - Hiển thị "No products found"
3. Sản phẩm hết hàng:
   - Hiển thị cảnh báo "Out of stock"
   - Disable nút Add to Cart

#### 6.2. Error handling
1. Disconnect internet:
   - Thêm sản phẩm vẫn hoạt động (local)
   - Sync với server sẽ fail nhưng không ảnh hưởng UX
2. API errors:
   - Hiển thị error message phù hợp
   - App không crash

#### 6.3. Performance
1. Thêm nhiều sản phẩm vào giỏ:
   - UI vẫn responsive
   - Không có lag
2. Search với từ khóa dài:
   - Debounced search
   - Không spam API calls

### 7. Test data persistence

#### 7.1. LocalStorage
1. Thêm sản phẩm vào giỏ
2. Refresh trang:
   - Giỏ hàng vẫn giữ nguyên
3. Mở tab mới:
   - Giỏ hàng sync giữa các tab

#### 7.2. Server sync
1. Login với user A, thêm sản phẩm
2. Logout, login với user B:
   - Giỏ hàng của user B được load
3. Login lại user A:
   - Giỏ hàng của user A được restore

### 8. Checklist hoàn thành

- [ ] Thêm sản phẩm vào giỏ hàng
- [ ] Xem giỏ hàng
- [ ] Cập nhật số lượng
- [ ] Xóa sản phẩm
- [ ] Xóa toàn bộ giỏ hàng
- [ ] Tìm kiếm sản phẩm
- [ ] Lọc theo danh mục
- [ ] Sắp xếp sản phẩm
- [ ] Xem chi tiết sản phẩm
- [ ] Checkout process
- [ ] Đăng nhập/đăng xuất
- [ ] Sync với server
- [ ] Responsive design
- [ ] Empty states
- [ ] Error handling
- [ ] Performance
- [ ] Data persistence

### 9. Lưu ý khi test

1. **Luôn test với dữ liệu thật** từ API
2. **Test trên nhiều browser** khác nhau
3. **Test với network slow** để kiểm tra loading states
4. **Test với dữ liệu lớn** (nhiều sản phẩm)
5. **Test với user permissions** khác nhau (admin vs user)
6. **Test với invalid data** (sản phẩm không tồn tại, giá âm, etc.)

### 10. Bug reporting

Khi gặp bug, ghi lại:
1. **Steps to reproduce**: Các bước tái tạo lỗi
2. **Expected behavior**: Hành vi mong đợi
3. **Actual behavior**: Hành vi thực tế
4. **Environment**: Browser, OS, screen size
5. **Console errors**: Lỗi trong console
6. **Network errors**: Lỗi API calls
