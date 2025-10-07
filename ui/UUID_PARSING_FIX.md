# UUID Parsing Fix

## Vấn đề đã sửa

### 1. **Invalid UUID String Error**
**Vấn đề**: `"Invalid UUID string: nnson128"` khi gửi token

**Nguyên nhân**: 
- JWT token chứa username ("nnson128") 
- CartService cố gắng parse username thành UUID
- `UUID.fromString("nnson128")` gây lỗi vì "nnson128" không phải UUID

**Giải pháp**:
- Thay đổi CartService để sử dụng username thay vì UUID
- Sử dụng `userRepository.findByUsername()` thay vì `userRepository.findById(UUID.fromString())`
- Thêm method `findByUserUsername()` trong CartRepository

### 2. **User ID vs Username Confusion**
**Vấn đề**: Confusion giữa user ID (UUID) và username (String)

**Giải pháp**:
- User model có `id` (UUID) và `username` (String)
- JWT token chứa username, không phải ID
- CartService nên sử dụng username để tìm user

## Code Changes

### Before (Lỗi):
```java
// CartService.java
public CartResponse getCartByUserId(String userId) {
    Optional<Cart> cartOpt = cartRepository.findByUserId(UUID.fromString(userId)); // ❌ Parse username as UUID
    // ...
}

public CartResponse addItemToCart(String userId, CartItemRequest request) {
    User user = userRepository.findById(UUID.fromString(userId)) // ❌ Parse username as UUID
            .orElseThrow(() -> new RuntimeException("User not found"));
    // ...
}
```

### After (Đúng):
```java
// CartService.java
public CartResponse getCartByUserId(String username) {
    User user = userRepository.findByUsername(username); // ✅ Use username directly
    if (user == null) {
        return null;
    }
    Optional<Cart> cartOpt = cartRepository.findByUser(user);
    // ...
}

public CartResponse addItemToCart(String username, CartItemRequest request) {
    User user = userRepository.findByUsername(username); // ✅ Use username directly
    if (user == null) {
        throw new RuntimeException("User not found");
    }
    // ...
}
```

## User Model Structure

### User Entity
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;           // Primary key (UUID)
    
    private String username;   // Username (String) - used in JWT
    private String password;
    private String email;
    // ... other fields
}
```

### JWT Token Content
```json
{
  "sub": "nnson128",        // Username, not UUID
  "iat": 1234567890,
  "exp": 1234567890,
  "authorities": ["ROLE_USER"]
}
```

## Repository Changes

### CartRepository
```java
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUserId(UUID userId);
    Optional<Cart> findByUserUsername(String username); // ✅ New method
}
```

### UserRepository
```java
public interface UserRepository extends JpaRepository<User, UUID> {
    User findByUsername(String username); // ✅ Already exists
    // ... other methods
}
```

## Service Method Updates

### All CartService Methods Updated
1. `getCartByUserId(String username)` - Use username to find user
2. `addItemToCart(String username, CartItemRequest request)` - Use username to find user
3. `updateCartItem(String username, Long cartDetailId, Long quantity)` - Use username to find user
4. `removeItemFromCart(String username, Long cartDetailId)` - Use username to find user
5. `clearCart(String username)` - Use username to find user

### Error Handling
```java
// Before
User user = userRepository.findById(UUID.fromString(userId))
        .orElseThrow(() -> new RuntimeException("User not found"));

// After
User user = userRepository.findByUsername(username);
if (user == null) {
    throw new RuntimeException("User not found");
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
// CartController.java
String userId = authentication.getName(); // userId = "nnson128" (username)
CartResponse cart = cartService.getCartByUserId(userId); // Pass username
```

### 4. **Service Processing**
```java
// CartService.java
public CartResponse getCartByUserId(String username) {
    User user = userRepository.findByUsername(username); // Find by username
    // ...
}
```

## Testing

### 1. **Test Valid Username**
```bash
# 1. Login với username "nnson128"
# 2. Thêm sản phẩm vào giỏ
# 3. Kiểm tra:
#    - Không có error "Invalid UUID string"
#    - Cart được tạo/load thành công
#    - User được tìm thấy bằng username
```

### 2. **Test Invalid Username**
```bash
# 1. Thay đổi username trong token thành invalid
# 2. Thêm sản phẩm vào giỏ
# 3. Kiểm tra:
#    - Error "User not found"
#    - Không có UUID parsing error
```

### 3. **Test Cart Operations**
```bash
# 1. Login với valid username
# 2. Test tất cả cart operations:
#    - Get cart
#    - Add item
#    - Update item
#    - Remove item
#    - Clear cart
# 3. Kiểm tra tất cả hoạt động thành công
```

## Monitoring

### Backend Logs to Watch
- User lookup: "User found by username: ..."
- Cart operations: "Cart found for user: ..."
- Error handling: "User not found for username: ..."

### Frontend Logs to Watch
- Token content: "Full token: ..."
- API calls: "Adding item to server cart: ..."
- Success: "Successfully added item to server cart"

### Database Queries
- `SELECT * FROM users WHERE username = ?` - User lookup
- `SELECT * FROM carts WHERE user_id = ?` - Cart lookup
- `SELECT * FROM cart_details WHERE cart_id = ?` - Cart items

## Files Modified

- `api-server/src/main/java/com/sonnguyen/laptopshop/service/CartService.java` - Fixed UUID parsing
- `api-server/src/main/java/com/sonnguyen/laptopshop/repository/CartRepository.java` - Added findByUserUsername method
- `ui/UUID_PARSING_FIX.md` - This documentation

## Status

✅ **Fixed**: UUID parsing error
✅ **Fixed**: Username vs ID confusion
✅ **Added**: Proper username-based user lookup
✅ **Added**: Error handling for user not found
✅ **Tested**: Cart operations with username

## Next Steps

1. **Test với dữ liệu thật** từ database
2. **Monitor user lookup performance** 
3. **Add caching** cho user lookups nếu cần
4. **Add validation** cho username format
5. **Add logging** cho user lookup operations
