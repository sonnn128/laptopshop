# Cart Features Documentation

## Tổng quan
Hệ thống giỏ hàng (Cart) đã được tích hợp hoàn chỉnh vào ứng dụng Laptop Shop với các tính năng sau:

## Các tính năng chính

### 1. CartContext (ui/src/contexts/CartContext.jsx)
- **Quản lý state giỏ hàng**: Lưu trữ danh sách sản phẩm, số lượng, tổng giá
- **Đồng bộ với localStorage**: Tự động lưu và khôi phục giỏ hàng từ localStorage
- **Đồng bộ với server**: Tự động sync với API khi user đã đăng nhập
- **Các chức năng**:
  - `addToCart(product, quantity)`: Thêm sản phẩm vào giỏ
  - `updateQuantity(productId, quantity)`: Cập nhật số lượng
  - `removeFromCart(productId)`: Xóa sản phẩm khỏi giỏ
  - `clearCart()`: Xóa toàn bộ giỏ hàng
  - `loadCartFromServer()`: Tải giỏ hàng từ server
  - `syncCartWithServer()`: Đồng bộ giỏ hàng local với server

### 2. AddToCartButton Component (ui/src/components/AddToCartButton.jsx)
- **Component tái sử dụng** để thêm sản phẩm vào giỏ hàng
- **Hỗ trợ 2 chế độ**:
  - `showQuantity={true}`: Hiển thị input số lượng + nút Add to Cart
  - `showQuantity={false}`: Chỉ hiển thị nút Add to Cart
- **Tích hợp với CartContext**: Tự động cập nhật state giỏ hàng
- **Loading states**: Hiển thị trạng thái loading khi đang xử lý

### 3. CartPage (ui/src/pages/CartPage.jsx)
- **Giao diện giỏ hàng hoàn chỉnh** với bảng sản phẩm
- **Các chức năng**:
  - Xem danh sách sản phẩm trong giỏ
  - Cập nhật số lượng sản phẩm
  - Xóa sản phẩm khỏi giỏ
  - Xóa toàn bộ giỏ hàng
  - Tính tổng giá tiền
  - Chuyển đến trang checkout
- **Empty state**: Hiển thị thông báo khi giỏ hàng trống
- **Loading states**: Hiển thị spinner khi đang tải dữ liệu

### 4. ProductPage (ui/src/pages/ProductPage.jsx)
- **Danh sách sản phẩm** với tìm kiếm và lọc
- **Tích hợp AddToCartButton** trong mỗi sản phẩm
- **Các tính năng**:
  - Tìm kiếm sản phẩm theo tên
  - Lọc theo danh mục
  - Sắp xếp theo giá, tên, ngày tạo
  - Phân trang
  - Click vào sản phẩm để xem chi tiết

### 5. ProductDetailPage (ui/src/pages/ProductDetailPage.jsx)
- **Trang chi tiết sản phẩm** với thông tin đầy đủ
- **Tích hợp AddToCartButton** với chọn số lượng
- **Các thông tin hiển thị**:
  - Hình ảnh sản phẩm
  - Tên, giá, nhà sản xuất
  - Danh mục, số lượng tồn kho
  - Mô tả sản phẩm
  - Đối tượng sử dụng
- **Kiểm tra tồn kho**: Hiển thị cảnh báo khi hết hàng

### 6. HomePage (ui/src/pages/HomePage.jsx)
- **Trang chủ** với sản phẩm nổi bật
- **Tích hợp AddToCartButton** cho sản phẩm featured
- **Các tính năng**:
  - Hero section với CTA
  - Features section
  - Featured products section
  - Navigation đến trang sản phẩm

### 7. CheckoutPage (ui/src/pages/CheckoutPage.jsx)
- **Trang thanh toán** hoàn chỉnh
- **Các chức năng**:
  - Form thông tin giao hàng
  - Hiển thị tóm tắt đơn hàng
  - Tích hợp với API đặt hàng
  - Tự động điền thông tin user
  - Validation form
  - Xóa giỏ hàng sau khi đặt hàng thành công

### 8. Navbar (ui/src/components/layout/Navbar.jsx)
- **Hiển thị số lượng sản phẩm** trong giỏ hàng
- **Badge counter** cập nhật real-time
- **Click vào icon giỏ hàng** để chuyển đến CartPage

## Cách sử dụng

### Thêm sản phẩm vào giỏ hàng
```jsx
import AddToCartButton from '../components/AddToCartButton.jsx';

// Với chọn số lượng
<AddToCartButton 
  product={product} 
  size="large"
  showQuantity={true}
/>

// Chỉ nút Add to Cart
<AddToCartButton 
  product={product} 
  size="small"
  showQuantity={false}
/>
```

### Sử dụng CartContext
```jsx
import { useCart } from '../contexts/CartContext.jsx';

const MyComponent = () => {
  const { 
    cartItems, 
    totalItems, 
    totalPrice, 
    addToCart, 
    updateQuantity, 
    removeFromCart 
  } = useCart();

  // Sử dụng các function và state
};
```

## API Integration

### Endpoints được sử dụng:
- `GET /products` - Lấy danh sách sản phẩm
- `GET /products/:id` - Lấy chi tiết sản phẩm
- `GET /categories` - Lấy danh sách danh mục
- `POST /carts/add` - Thêm sản phẩm vào giỏ (server)
- `PUT /carts/update/:productId` - Cập nhật số lượng (server)
- `DELETE /carts/remove/:productId` - Xóa sản phẩm (server)
- `DELETE /carts/clear` - Xóa toàn bộ giỏ (server)
- `GET /carts` - Lấy giỏ hàng từ server
- `POST /orders` - Đặt hàng

## Lưu ý kỹ thuật

### 1. State Management
- Sử dụng React Context + useReducer pattern
- LocalStorage để persist data
- Auto-sync với server khi user đã login

### 2. Error Handling
- Try-catch cho tất cả API calls
- User-friendly error messages
- Fallback khi API fails

### 3. Performance
- useMemo cho calculations
- Optimistic updates
- Debounced search

### 4. UX/UI
- Loading states cho tất cả async operations
- Empty states khi không có data
- Responsive design
- Consistent styling với Ant Design

## Testing

### Các test case cần kiểm tra:
1. Thêm sản phẩm vào giỏ hàng
2. Cập nhật số lượng sản phẩm
3. Xóa sản phẩm khỏi giỏ
4. Xóa toàn bộ giỏ hàng
5. Tính tổng giá tiền chính xác
6. Đồng bộ với server khi login/logout
7. Persist data với localStorage
8. Form validation trong checkout
9. Đặt hàng thành công
10. Responsive trên mobile

## Troubleshooting

### Lỗi thường gặp:
1. **Cart không sync với server**: Kiểm tra token authentication
2. **LocalStorage bị clear**: Kiểm tra browser settings
3. **API calls fail**: Kiểm tra network và server status
4. **State không update**: Kiểm tra dependencies trong useEffect

### Debug tips:
- Sử dụng React DevTools để inspect state
- Check console logs cho API errors
- Verify localStorage data
- Test với different user roles
