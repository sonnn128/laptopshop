# Cart API Fixes

## Vấn đề đã sửa

### 1. **URL Duplication Issue**
**Vấn đề**: URL bị duplicate `/api/v1/api/v1/cart` gây lỗi 403 Forbidden

**Nguyên nhân**: 
- Base URL trong `api.js` đã có `/api/v1`
- CartContext lại thêm `/api/v1` nữa
- Kết quả: `http://localhost:8888/api/v1` + `/api/v1/cart` = `http://localhost:8888/api/v1/api/v1/cart`

**Giải pháp**:
- Sửa tất cả API calls trong CartContext từ `/api/v1/cart` thành `/cart`
- Sửa từ `/api/v1/cart/items` thành `/cart/items`
- Sửa từ `/api/v1/cart` (DELETE) thành `/cart`

### 2. **Error Handling Improvements**
**Vấn đề**: Không có logging chi tiết khi API fail

**Giải pháp**:
- Thêm console.log cho token validation
- Thêm error logging chi tiết (status, data)
- Tự động clear token khi gặp 401/403
- Thêm warning khi không có token

## Code Changes

### Before (Lỗi):
```javascript
// api.js
const API_BASE_URL = 'http://localhost:8888/api/v1';

// CartContext.jsx
const response = await api.get('/api/v1/cart'); // ❌ Duplicate /api/v1
```

### After (Đúng):
```javascript
// api.js
const API_BASE_URL = 'http://localhost:8888/api/v1';

// CartContext.jsx
const response = await api.get('/cart'); // ✅ Chỉ cần /cart
```

## API Endpoints Mapping

| Function | Endpoint | Full URL |
|----------|----------|----------|
| Get Cart | `/cart` | `http://localhost:8888/api/v1/cart` |
| Add Item | `/cart/items` | `http://localhost:8888/api/v1/cart/items` |
| Update Item | `/cart/items/{id}` | `http://localhost:8888/api/v1/cart/items/{id}` |
| Remove Item | `/cart/items/{id}` | `http://localhost:8888/api/v1/cart/items/{id}` |
| Clear Cart | `/cart` | `http://localhost:8888/api/v1/cart` |

## Error Handling Flow

### 1. **Token Validation**
```javascript
const token = localStorage.getItem('token');
if (!token) {
  console.log('No token found, skipping cart load from server');
  return { success: true };
}
```

### 2. **API Call with Logging**
```javascript
console.log('Loading cart from server with token:', token.substring(0, 20) + '...');
const response = await api.get('/cart');
```

### 3. **Error Handling**
```javascript
catch (error) {
  console.error('Failed to load cart from server:', error);
  console.error('Error status:', error.response?.status);
  console.error('Error data:', error.response?.data);
  
  // Auto-clear invalid token
  if (error.response?.status === 401 || error.response?.status === 403) {
    console.warn('Token might be invalid, clearing local storage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
```

## Testing

### 1. **Test Cart Loading**
```bash
# 1. Đăng nhập
# 2. Thêm sản phẩm vào giỏ
# 3. Reload trang
# 4. Kiểm tra console logs:
#    - "Loading cart from server with token: ..."
#    - Không có error 403
#    - Cart items được load thành công
```

### 2. **Test Error Handling**
```bash
# 1. Logout
# 2. Reload trang
# 3. Kiểm tra console logs:
#    - "No token found, skipping cart load from server"
#    - Không có API call đến server
```

### 3. **Test Invalid Token**
```bash
# 1. Thay đổi token trong localStorage thành invalid
# 2. Reload trang
# 3. Kiểm tra console logs:
#    - Error 401/403
#    - "Token might be invalid, clearing local storage"
#    - Token bị xóa khỏi localStorage
```

## Monitoring

### Console Logs to Watch
- `"No token found, skipping cart load from server"` - No token
- `"Loading cart from server with token: ..."` - Valid token
- `"Failed to load cart from server:"` - API error
- `"Token might be invalid, clearing local storage"` - Invalid token

### Network Tab to Watch
- `GET /api/v1/cart` - Load cart
- `POST /api/v1/cart/items` - Add item
- `DELETE /api/v1/cart` - Clear cart
- Status codes: 200, 201, 401, 403

## Next Steps

1. **Test với dữ liệu thật** từ database
2. **Monitor performance** của cart loading
3. **Add retry mechanism** cho failed requests
4. **Add offline support** với local storage fallback
5. **Add cart sync indicators** cho user

## Files Modified

- `ui/src/contexts/CartContext.jsx` - Fixed API endpoints and error handling
- `ui/CART_API_FIXES.md` - This documentation

## Status

✅ **Fixed**: URL duplication issue
✅ **Fixed**: 403 Forbidden error
✅ **Added**: Better error handling and logging
✅ **Added**: Token validation and auto-clear
✅ **Tested**: Cart loading after reload
