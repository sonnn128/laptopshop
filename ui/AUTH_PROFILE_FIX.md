# Auth Profile Endpoint Fix

## Vấn đề đã sửa

### 1. **Authentication Null in Profile Endpoint**
**Vấn đề**: `Cannot invoke "org.springframework.security.core.Authentication.getName()" because "authentication" is null` khi gọi `/api/v1/auth/profile`

**Nguyên nhân**: 
- JWT filter coi tất cả `/api/v1/auth/` endpoints là public
- Điều này khiến `/api/v1/auth/profile` không được authenticate
- Authentication object null trong controller

**Giải pháp**:
- Sửa JWT filter để chỉ cho phép `/login` và `/register` là public
- Thêm null check trong AuthController
- Đảm bảo `/profile` endpoint yêu cầu authentication

### 2. **JWT Filter Public Endpoints Too Broad**
**Vấn đề**: `requestURI.startsWith("/api/v1/auth/")` quá rộng

**Giải pháp**:
- Thay đổi thành specific endpoints: `/api/v1/auth/login` và `/api/v1/auth/register`
- Đảm bảo `/profile` endpoints yêu cầu authentication

## Code Changes

### Before (Lỗi):
```java
// JwtAuthenticationFilter.java
private boolean isPublicEndpoint(String requestURI) {
    return requestURI.startsWith("/swagger-ui") ||
           // ... other endpoints ...
           requestURI.startsWith("/api/v1/auth/"); // ❌ Too broad
}

// AuthController.java
@GetMapping("/profile")
public ResponseEntity<?> getProfile(Authentication authentication) {
    User user = authService.getCurrentUser(authentication.getName()); // ❌ NullPointerException
    // ...
}
```

### After (Đúng):
```java
// JwtAuthenticationFilter.java
private boolean isPublicEndpoint(String requestURI) {
    return requestURI.startsWith("/swagger-ui") ||
           // ... other endpoints ...
           requestURI.equals("/api/v1/auth/login") ||        // ✅ Specific endpoints
           requestURI.equals("/api/v1/auth/register");       // ✅ Specific endpoints
}

// AuthController.java
@GetMapping("/profile")
public ResponseEntity<?> getProfile(Authentication authentication) {
    if (authentication == null) {                            // ✅ Null check
        return ResponseEntity.status(401).body(
                ApiResponse.builder()
                        .success(false)
                        .message("Authentication required")
                        .build()
        );
    }
    User user = authService.getCurrentUser(authentication.getName()); // ✅ Safe
    // ...
}
```

## Public vs Protected Endpoints

### Public Endpoints (No Authentication Required)
- `/api/v1/auth/login` - User login
- `/api/v1/auth/register` - User registration
- `/api/v1/products/**` - Product listing (GET only)
- `/api/v1/categories/**` - Category listing (GET only)
- Swagger endpoints

### Protected Endpoints (Authentication Required)
- `/api/v1/auth/profile` - Get user profile (GET)
- `/api/v1/auth/profile` - Update user profile (PUT)
- `/api/v1/cart/**` - All cart operations
- `/api/v1/orders/**` - All order operations
- All other endpoints

## Authentication Flow

### 1. **Public Endpoints**
```java
// JwtAuthenticationFilter.java
if (isPublicEndpoint(requestURI) || isPublicGetEndpoint(requestURI, request.getMethod())) {
    filterChain.doFilter(request, response); // Skip JWT processing
    return;
}
```

### 2. **Protected Endpoints**
```java
// JwtAuthenticationFilter.java
// Process JWT token and set authentication context
String jwt = authHeader.substring(7);
String username = jwtService.extractUsername(jwt);
if (username != null) {
    UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(username);
    if (jwtService.isTokenValid(jwt, userDetails)) {
        // Set authentication context
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}
```

### 3. **Controller Null Check**
```java
// AuthController.java
if (authentication == null) {
    return ResponseEntity.status(401).body(
            ApiResponse.builder()
                    .success(false)
                    .message("Authentication required")
                    .build()
    );
}
```

## Error Handling

### Backend Error Handling
```java
// AuthController.java
if (authentication == null) {
    return ResponseEntity.status(401).body(
            ApiResponse.builder()
                    .success(false)
                    .message("Authentication required")
                    .build()
    );
}
```

### Frontend Error Handling
```javascript
// Handle 401 response
if (response.status === 401) {
    // Redirect to login or show error
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}
```

## Testing

### 1. **Test Public Endpoints**
```bash
# 1. Test login without token
curl -X POST http://localhost:8888/api/v1/auth/login
# Expected: 200 OK (public endpoint)

# 2. Test register without token
curl -X POST http://localhost:8888/api/v1/auth/register
# Expected: 200 OK (public endpoint)
```

### 2. **Test Protected Endpoints**
```bash
# 1. Test profile without token
curl -X GET http://localhost:8888/api/v1/auth/profile
# Expected: 401 Unauthorized

# 2. Test profile with valid token
curl -X GET http://localhost:8888/api/v1/auth/profile \
  -H "Authorization: Bearer <valid_token>"
# Expected: 200 OK with user data
```

### 3. **Test Invalid Token**
```bash
# 1. Test profile with invalid token
curl -X GET http://localhost:8888/api/v1/auth/profile \
  -H "Authorization: Bearer invalid_token"
# Expected: 401 Unauthorized
```

## Monitoring

### Backend Logs to Watch
- JWT filter logs: "Request: uri = ..., method = ..., authHeader = ..."
- Authentication success: "Authentication set for user: ..."
- Authentication failure: "Invalid token for user: ..."
- Public endpoint access: "Skipping JWT processing for public endpoint"

### Frontend Logs to Watch
- API call success/failure
- 401 error handling
- Token validation

### Network Tab to Watch
- Authorization header trong requests
- Response status codes (200, 401, 403)
- Error response data

## Files Modified

- `api-server/src/main/java/com/sonnguyen/laptopshop/config/JwtAuthenticationFilter.java` - Fixed public endpoints
- `api-server/src/main/java/com/sonnguyen/laptopshop/controller/AuthController.java` - Added null checks
- `ui/AUTH_PROFILE_FIX.md` - This documentation

## Status

✅ **Fixed**: Authentication null in profile endpoint
✅ **Fixed**: JWT filter public endpoints too broad
✅ **Added**: Null checks in AuthController
✅ **Added**: Proper endpoint protection
✅ **Tested**: Profile endpoints with authentication

## Next Steps

1. **Test với dữ liệu thật** từ database
2. **Monitor authentication logs** cho debugging
3. **Add rate limiting** cho auth endpoints
4. **Add request/response logging** cho audit trail
5. **Add token refresh mechanism** nếu cần
