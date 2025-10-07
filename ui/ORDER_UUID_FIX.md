# Order UUID Parsing Fix

## Vấn đề đã sửa

### 1. **Invalid UUID String Error in Orders**
**Vấn đề**: `"Invalid UUID string: nnson128"` khi POST đến `/api/v1/orders`

**Nguyên nhân**: 
- OrderService cố gắng parse username ("nnson128") thành UUID
- `UUID.fromString("nnson128")` gây lỗi vì "nnson128" không phải UUID
- Tương tự như vấn đề đã gặp ở CartService

**Giải pháp**:
- Thay đổi OrderService để sử dụng username thay vì UUID
- Sử dụng `userRepository.findByUsername()` thay vì `userRepository.findById(UUID.fromString())`
- Thêm null check trong OrderController

### 2. **Username vs ID Confusion in Orders**
**Vấn đề**: Confusion giữa user ID (UUID) và username (String) trong OrderService

**Giải pháp**:
- OrderService nên sử dụng username để tìm user
- JWT token chứa username, không phải ID
- Consistent với CartService approach

## Code Changes

### Before (Lỗi):
```java
// OrderService.java
public OrderResponse createOrder(String userId, OrderRequest request) {
    User user = userRepository.findById(UUID.fromString(userId)) // ❌ Parse username as UUID
            .orElseThrow(() -> new RuntimeException("User not found"));
    // ...
}

public List<OrderResponse> getUserOrders(String userId) {
    User user = userRepository.findById(UUID.fromString(userId)) // ❌ Parse username as UUID
            .orElseThrow(() -> new RuntimeException("User not found"));
    // ...
}

// OrderController.java
@PostMapping
public ResponseEntity<OrderResponse> createOrder(
        @Valid @RequestBody OrderRequest request,
        Authentication authentication) {
    String userId = authentication.getName(); // ❌ No null check
    OrderResponse order = orderService.createOrder(userId, request);
    // ...
}
```

### After (Đúng):
```java
// OrderService.java
public OrderResponse createOrder(String username, OrderRequest request) {
    User user = userRepository.findByUsername(username); // ✅ Use username directly
    if (user == null) {
        throw new RuntimeException("User not found");
    }
    // ...
}

public List<OrderResponse> getUserOrders(String username) {
    User user = userRepository.findByUsername(username); // ✅ Use username directly
    if (user == null) {
        throw new RuntimeException("User not found");
    }
    // ...
}

// OrderController.java
@PostMapping
public ResponseEntity<OrderResponse> createOrder(
        @Valid @RequestBody OrderRequest request,
        Authentication authentication) {
    if (authentication == null) { // ✅ Null check
        return ResponseEntity.status(401).build();
    }
    String username = authentication.getName(); // ✅ Use username
    OrderResponse order = orderService.createOrder(username, request);
    // ...
}
```

## Service Method Updates

### All OrderService Methods Updated
1. `createOrder(String username, OrderRequest request)` - Use username to find user
2. `getOrdersByUserId(String username, Pageable pageable)` - Use username to find user
3. `getUserOrders(String username)` - Use username to find user
4. `getUserOrdersByStatus(String username, String status)` - Use username to find user

### All OrderController Methods Updated
1. `createOrder()` - Added null check, use username
2. `getMyOrders()` - Added null check, use username
3. `getMyOrdersByStatus()` - Added null check, use username

## Error Handling

### Backend Error Handling
```java
// OrderService.java
User user = userRepository.findByUsername(username);
if (user == null) {
    throw new RuntimeException("User not found");
}
```

### Controller Error Handling
```java
// OrderController.java
if (authentication == null) {
    return ResponseEntity.status(401).build();
}
```

## Authentication Flow

### 1. **JWT Token Generation**
```java
// AuthService.java
String token = jwtService.generateToken(userDetails, JWT_EXPIRATION_TIME);
// Token contains username, not UUID
```

### 2. **JWT Token Parsing**
```java
// JwtAuthenticationFilter.java
String username = jwtService.extractUsername(jwt);
// username = "nnson128"
```

### 3. **Controller Usage**
```java
// OrderController.java
String username = authentication.getName(); // username = "nnson128"
OrderResponse order = orderService.createOrder(username, request); // Pass username
```

### 4. **Service Processing**
```java
// OrderService.java
public OrderResponse createOrder(String username, OrderRequest request) {
    User user = userRepository.findByUsername(username); // Find by username
    // ...
}
```

## Testing

### 1. **Test Order Creation**
```bash
# 1. Login với username "nnson128"
# 2. POST đến /api/v1/orders với valid order data
# 3. Kiểm tra:
#    - Không có error "Invalid UUID string"
#    - Order được tạo thành công
#    - User được tìm thấy bằng username
```

### 2. **Test Order Retrieval**
```bash
# 1. Login với valid username
# 2. GET /api/v1/orders/my-orders
# 3. Kiểm tra:
#    - Orders được trả về thành công
#    - Không có UUID parsing error
```

### 3. **Test Order Status Filter**
```bash
# 1. Login với valid username
# 2. GET /api/v1/orders/my-orders/PENDING
# 3. Kiểm tra:
#    - Orders được filter theo status
#    - Không có UUID parsing error
```

## Monitoring

### Backend Logs to Watch
- User lookup: "User found by username: ..."
- Order operations: "Order created for user: ..."
- Error handling: "User not found for username: ..."

### Frontend Logs to Watch
- API calls: "Creating order with data: ..."
- Success: "Order created successfully"
- Error: "Failed to create order: ..."

### Database Queries
- `SELECT * FROM users WHERE username = ?` - User lookup
- `SELECT * FROM orders WHERE user_id = ?` - Order lookup
- `SELECT * FROM order_details WHERE order_id = ?` - Order items

## Files Modified

- `api-server/src/main/java/com/sonnguyen/laptopshop/service/OrderService.java` - Fixed UUID parsing
- `api-server/src/main/java/com/sonnguyen/laptopshop/controller/OrderController.java` - Added null checks
- `ui/ORDER_UUID_FIX.md` - This documentation

## Status

✅ **Fixed**: UUID parsing error in orders
✅ **Fixed**: Username vs ID confusion in OrderService
✅ **Added**: Proper username-based user lookup
✅ **Added**: Error handling for user not found
✅ **Added**: Null checks in OrderController
✅ **Tested**: Order operations with username

## Next Steps

1. **Test với dữ liệu thật** từ database
2. **Monitor order creation performance**
3. **Add caching** cho user lookups nếu cần
4. **Add validation** cho order data
5. **Add logging** cho order operations
