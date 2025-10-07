# Debug Checkout Issues

## Các vấn đề có thể xảy ra và cách debug

### 1. **Data Type Issues**
- **Vấn đề**: Backend mong đợi `Long` nhưng frontend gửi `number`
- **Giải pháp**: Đã sửa bằng `parseInt()`
- **Test**: Kiểm tra console.log để xem data types

### 2. **Validation Issues**
- **Vấn đề**: Form validation có thể fail
- **Giải pháp**: Đã loại bỏ regex validation cho phone
- **Test**: Thử submit form với các giá trị khác nhau

### 3. **Empty Cart Issues**
- **Vấn đề**: Cart có thể bị empty khi submit
- **Giải pháp**: Đã thêm logging để kiểm tra
- **Test**: Kiểm tra console.log cart items

### 4. **Response Status Issues**
- **Vấn đề**: Response status có thể không phải 201
- **Giải pháp**: Đã kiểm tra status code
- **Test**: Kiểm tra console.log response status

### 5. **API Endpoint Issues**
- **Vấn đề**: API endpoint có thể không đúng
- **Giải pháp**: Đã sửa từ `/carts` thành `/cart`
- **Test**: Kiểm tra Network tab trong DevTools

## Cách debug step by step

### Step 1: Kiểm tra Console Logs
```javascript
// Mở DevTools Console và kiểm tra:
// 1. Form values
// 2. Cart items
// 3. Order data sent
// 4. Order response status
// 5. Order response data
// 6. Error details (nếu có)
```

### Step 2: Kiểm tra Network Tab
```javascript
// Mở DevTools Network tab và kiểm tra:
// 1. POST /api/v1/orders request
// 2. Request payload
// 3. Response status
// 4. Response data
// 5. Error response (nếu có)
```

### Step 3: Kiểm tra Backend Logs
```bash
# Kiểm tra terminal chạy Spring Boot:
# 1. Có request đến /api/v1/orders không?
# 2. Có error nào trong logs không?
# 3. Có validation error không?
```

### Step 4: Test với dữ liệu đơn giản
```javascript
// Test với dữ liệu tối thiểu:
const testOrderData = {
  receiverName: "Test User",
  receiverAddress: "Test Address",
  receiverPhone: "1234567890",
  cartItems: [{
    productId: 1,
    quantity: 1
  }]
};
```

## Các lỗi thường gặp

### 1. **Validation Error**
```
Error: Validation failed for argument [0] in public org.springframework.http.ResponseEntity<com.sonnguyen.laptopshop.payload.response.OrderResponse> com.sonnguyen.laptopshop.controller.OrderController.createOrder(com.sonnguyen.laptopshop.payload.request.OrderRequest,org.springframework.security.core.Authentication)
```
**Giải pháp**: Kiểm tra form validation và data types

### 2. **Product Not Found**
```
Error: Product not found
```
**Giải pháp**: Kiểm tra productId có tồn tại không

### 3. **Insufficient Quantity**
```
Error: Insufficient product quantity for product: [ProductName]
```
**Giải pháp**: Kiểm tra quantity trong cart vs quantity trong database

### 4. **User Not Found**
```
Error: User not found
```
**Giải pháp**: Kiểm tra authentication và user ID

### 5. **Database Constraint**
```
Error: Could not execute statement
```
**Giải pháp**: Kiểm tra database constraints và foreign keys

## Test Cases

### Test Case 1: Happy Path
1. Đăng nhập với user hợp lệ
2. Thêm sản phẩm vào giỏ hàng
3. Vào checkout page
4. Điền form đầy đủ
5. Submit order
6. Kiểm tra order được tạo thành công

### Test Case 2: Empty Cart
1. Vào checkout page với giỏ hàng trống
2. Kiểm tra có redirect về cart page không

### Test Case 3: Invalid Data
1. Submit form với phone number rỗng
2. Submit form với address rỗng
3. Kiểm tra validation error

### Test Case 4: Network Error
1. Disconnect internet
2. Submit order
3. Kiểm tra error handling

## Monitoring

### Frontend Logs
- Console.log trong CheckoutPage
- Error messages cho user
- Loading states

### Backend Logs
- Spring Boot application logs
- Hibernate SQL logs
- Exception stack traces

### Network Monitoring
- Request/Response trong DevTools
- Status codes
- Response times
- Error responses

## Next Steps

1. **Test với dữ liệu thật** từ database
2. **Kiểm tra tất cả validation rules**
3. **Test với các edge cases**
4. **Monitor performance**
5. **Add more error handling**
