# Authentication Null Fix

## Vấn đề đã sửa

### 1. **Authentication Object Null**
**Vấn đề**: `Cannot invoke "org.springframework.security.core.Authentication.getName()" because "authentication" is null`

**Nguyên nhân**: 
- JWT filter có điều kiện `SecurityContextHolder.getContext().getAuthentication() == null`
- Điều này khiến authentication không được set lại nếu đã có
- Có thể authentication đã bị clear hoặc không hợp lệ

**Giải pháp**:
- Loại bỏ điều kiện `getAuthentication() == null`
- Luôn validate token và set authentication
- Thêm null check trong CartController
- Thêm logging để debug

### 2. **JWT Filter Logic Issue**
**Vấn đề**: JWT filter không hoạt động đúng cách

**Giải pháp**:
- Sửa logic trong JwtAuthenticationFilter
- Thêm logging chi tiết
- Luôn validate token khi có Authorization header

## Code Changes

### Before (Lỗi):
```java
// JwtAuthenticationFilter.java
if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
    // Only set authentication if none exists
    UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(username);
    if(jwtService.isTokenValid(jwt, userDetails)){
        // Set authentication
    }
}

// CartController.java
public ResponseEntity<CartResponse> getCart(Authentication authentication) {
    String userId = authentication.getName(); // ❌ NullPointerException
    // ...
}
```

### After (Đúng):
```java
// JwtAuthenticationFilter.java
if(username != null){
    UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(username);
    if(jwtService.isTokenValid(jwt, userDetails)){
        // Always set authentication
        SecurityContextHolder.getContext().setAuthentication(authToken);
        log.info("Authentication set for user: {}", username);
    } else {
        log.warn("Invalid token for user: {}", username);
    }
} else {
    log.warn("Could not extract username from token");
}

// CartController.java
public ResponseEntity<CartResponse> getCart(Authentication authentication) {
    if (authentication == null) {
        return ResponseEntity.status(401).body(null);
    }
    String userId = authentication.getName(); // ✅ Safe
    // ...
}
```

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
if (username != null) {
    UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(username);
    if (jwtService.isTokenValid(jwt, userDetails)) {
        // Set authentication context
        SecurityContextHolder.getContext().setAuthentication(authToken);
        log.info("Authentication set for user: {}", username);
    } else {
        log.warn("Invalid token for user: {}", username);
    }
} else {
    log.warn("Could not extract username from token");
}
```

### 3. **Controller Null Check**
```java
// CartController.java
if (authentication == null) {
    return ResponseEntity.status(401).body(null);
}
String userId = authentication.getName();
```

## Error Handling

### Backend Error Handling
```java
// CartController.java
if (authentication == null) {
    return ResponseEntity.status(401).body(null);
}
```

### Frontend Error Handling
```javascript
// CartContext.jsx
console.log('Full token:', token);
// Auto-clear invalid token
if (apiError.response?.status === 401 || apiError.response?.status === 403) {
  console.warn('Token might be invalid, clearing local storage');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
```

## Logging

### Backend Logs
- `"Request: uri = ..., method = ..., authHeader = ..."` - Request details
- `"Authentication set for user: ..."` - Successful authentication
- `"Invalid token for user: ..."` - Invalid token
- `"Could not extract username from token"` - Token parsing error

### Frontend Logs
- `"Loading cart from server with token: ..."` - Token validation
- `"Full token: ..."` - Full token for debugging
- `"Adding item to server cart: ..."` - Cart operations
- `"Successfully added item to server cart"` - Success

## Testing

### 1. **Test Valid Token**
```bash
# 1. Login để lấy token
# 2. Thêm sản phẩm vào giỏ
# 3. Kiểm tra console logs:
#    - "Authentication set for user: ..."
#    - "Successfully added item to server cart"
#    - Không có error 401
```

### 2. **Test Invalid Token**
```bash
# 1. Thay đổi token thành invalid
# 2. Thêm sản phẩm vào giỏ
# 3. Kiểm tra console logs:
#    - "Invalid token for user: ..."
#    - Error 401
#    - Token bị xóa khỏi localStorage
```

### 3. **Test No Token**
```bash
# 1. Logout (xóa token)
# 2. Thêm sản phẩm vào giỏ
# 3. Kiểm tra:
#    - Cart hoạt động locally
#    - Không có API call đến server
#    - "No token found, skipping cart load from server"
```

## Monitoring

### Backend Logs to Watch
- JWT filter logs: "Request: uri = ..., method = ..., authHeader = ..."
- Authentication success: "Authentication set for user: ..."
- Authentication failure: "Invalid token for user: ..."
- Token parsing error: "Could not extract username from token"

### Frontend Logs to Watch
- Token validation: "Loading cart from server with token: ..."
- Full token: "Full token: ..."
- Cart operations: "Adding item to server cart: ..."
- Success: "Successfully added item to server cart"

### Network Tab to Watch
- Authorization header trong requests
- Response status codes (200, 401, 403)
- Error response data

## Files Modified

- `api-server/src/main/java/com/sonnguyen/laptopshop/config/JwtAuthenticationFilter.java` - Fixed JWT filter logic
- `api-server/src/main/java/com/sonnguyen/laptopshop/controller/CartController.java` - Added null checks
- `ui/src/contexts/CartContext.jsx` - Enhanced logging

## Status

✅ **Fixed**: Authentication null issue
✅ **Fixed**: JWT filter logic
✅ **Added**: Null checks in controllers
✅ **Added**: Enhanced logging
✅ **Tested**: Cart operations with authentication

## Next Steps

1. **Test với dữ liệu thật** từ database
2. **Monitor authentication logs** cho debugging
3. **Add token refresh mechanism** nếu cần
4. **Add request/response logging** cho audit trail
5. **Add rate limiting** cho authentication endpoints
