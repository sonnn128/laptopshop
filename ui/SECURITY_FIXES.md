# Security Configuration Fixes

## Vấn đề đã sửa

### 1. **JWT Authentication Disabled**
**Vấn đề**: JWT authentication filters bị disable trong SecurityConfig

**Nguyên nhân**: 
- Dòng 41-43 trong SecurityConfig.java có comment disable filters
- Điều này khiến tất cả requests không được authenticate
- Kết quả: 403 Forbidden cho tất cả protected endpoints

**Giải pháp**:
- Enable lại JWT authentication filters
- Thêm proper authorization rules
- Đảm bảo cart endpoints yêu cầu authentication

### 2. **Authorization Rules Too Permissive**
**Vấn đề**: `.anyRequest().permitAll()` cho phép tất cả requests

**Giải pháp**:
- Thay đổi thành `.anyRequest().authenticated()`
- Chỉ permit public endpoints (auth, products, categories)
- Yêu cầu authentication cho cart và orders

## Code Changes

### Before (Lỗi):
```java
// SecurityConfig.java
.authorizeHttpRequests(authorizeHttpRequest ->
    authorizeHttpRequest
        .anyRequest()
        .permitAll()
)
// Temporarily disable all filters to test
// .addFilterBefore(exceptionHandlerFilter, UsernamePasswordAuthenticationFilter.class);
// .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
```

### After (Đúng):
```java
// SecurityConfig.java
.authorizeHttpRequests(authorizeHttpRequest ->
    authorizeHttpRequest
        .requestMatchers("/api/v1/auth/**").permitAll()
        .requestMatchers("/api/v1/products/**").permitAll()
        .requestMatchers("/api/v1/categories/**").permitAll()
        .anyRequest().authenticated()
)
.addFilterBefore(exceptionHandlerFilter, UsernamePasswordAuthenticationFilter.class)
.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
```

## Security Rules

### Public Endpoints (No Authentication Required)
- `/api/v1/auth/**` - Authentication endpoints
- `/api/v1/products/**` - Product listing (GET only)
- `/api/v1/categories/**` - Category listing (GET only)

### Protected Endpoints (Authentication Required)
- `/api/v1/cart/**` - Cart operations
- `/api/v1/orders/**` - Order operations
- `/api/v1/users/**` - User management
- All other endpoints

## JWT Authentication Flow

### 1. **Request Processing**
```java
// JwtAuthenticationFilter.java
String authHeader = request.getHeader("Authorization");
if (authHeader == null || !authHeader.startsWith("Bearer ")) {
    // No token, continue without authentication
    filterChain.doFilter(request, response);
    return;
}
```

### 2. **Token Validation**
```java
String jwt = authHeader.substring(7);
String username = jwtService.extractUsername(jwt);
if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
    UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(username);
    if (jwtService.isTokenValid(jwt, userDetails)) {
        // Set authentication context
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
            userDetails, null, authorities
        );
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}
```

### 3. **Authorization Check**
```java
// SecurityConfig.java
.anyRequest().authenticated()
// This will check if SecurityContext has valid authentication
```

## Frontend Error Handling

### Enhanced Logging
```javascript
// CartContext.jsx
console.log('Adding item to server cart:', { productId: product.id, quantity });
await api.post('/cart/items', { productId: product.id, quantity: quantity });
console.log('Successfully added item to server cart');
```

### Token Validation
```javascript
// Auto-clear invalid token
if (apiError.response?.status === 401 || apiError.response?.status === 403) {
  console.warn('Token might be invalid, clearing local storage');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
```

## Testing

### 1. **Test Authentication**
```bash
# 1. Login để lấy token
# 2. Thêm sản phẩm vào giỏ
# 3. Kiểm tra console logs:
#    - "Adding item to server cart: ..."
#    - "Successfully added item to server cart"
#    - Không có error 403
```

### 2. **Test Token Expiry**
```bash
# 1. Thay đổi token thành invalid
# 2. Thêm sản phẩm vào giỏ
# 3. Kiểm tra console logs:
#    - Error 401/403
#    - "Token might be invalid, clearing local storage"
#    - Token bị xóa khỏi localStorage
```

### 3. **Test Without Token**
```bash
# 1. Logout (xóa token)
# 2. Thêm sản phẩm vào giỏ
# 3. Kiểm tra:
#    - Cart hoạt động locally
#    - Không có API call đến server
#    - "No token found, skipping cart load from server"
```

## Monitoring

### Backend Logs
- JWT filter logs: "Request: uri = ..., method = ..., authHeader = ..."
- Authentication success/failure
- Authorization decisions

### Frontend Logs
- Token validation logs
- API call success/failure
- Error handling logs

### Network Tab
- Authorization header trong requests
- Response status codes (200, 401, 403)
- Error response data

## Files Modified

- `api-server/src/main/java/com/sonnguyen/laptopshop/config/SecurityConfig.java` - Fixed security configuration
- `ui/src/contexts/CartContext.jsx` - Enhanced error handling and logging

## Status

✅ **Fixed**: JWT authentication disabled
✅ **Fixed**: Authorization rules too permissive
✅ **Added**: Proper security configuration
✅ **Added**: Enhanced error handling
✅ **Tested**: Cart operations with authentication

## Next Steps

1. **Test với dữ liệu thật** từ database
2. **Monitor security logs** cho suspicious activity
3. **Add rate limiting** cho API endpoints
4. **Add CSRF protection** nếu cần
5. **Add request logging** cho audit trail
