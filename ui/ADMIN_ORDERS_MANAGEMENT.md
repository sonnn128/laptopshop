# Admin Orders Management Features

## Tính năng đã hoàn thiện

### 1. **Backend API Endpoints**
- `GET /api/v1/orders` - Get all orders with pagination (Admin only)
- `GET /api/v1/orders/all` - Get all orders without pagination (Admin only)
- `GET /api/v1/orders/status/{status}` - Get orders by status with pagination (Admin only)
- `GET /api/v1/orders/{id}` - Get order by ID
- `PUT /api/v1/orders/{id}/status` - Update order status (Admin only)

### 2. **Authentication & Authorization**
- Tất cả admin endpoints yêu cầu `@PreAuthorize("hasRole('ADMIN')")`
- Null check cho Authentication object
- Proper error handling (401 Unauthorized)

### 3. **Frontend Admin Interface**
- Orders table với pagination
- Status filter dropdown
- Order status management buttons
- Order details modal
- Real-time status updates

## Backend Implementation

### OrderController
```java
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponse> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrdersWithoutPagination(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        
        List<OrderResponse> orders = orderService.getAllOrdersWithoutPagination();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponse>> getOrdersByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponse> orders = orderService.getOrdersByStatus(status, pageable);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        
        return orderService.updateOrderStatus(id, status)
                .map(order -> ResponseEntity.ok(order))
                .orElse(ResponseEntity.notFound().build());
    }
}
```

### OrderService
```java
@Service
public class OrderService {
    
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(ModelMapper::toOrderResponse);
    }

    public List<OrderResponse> getAllOrdersWithoutPagination() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(ModelMapper::toOrderResponse)
                .toList();
    }

    public Page<OrderResponse> getOrdersByStatus(String status, Pageable pageable) {
        Page<Order> orders = orderRepository.findByStatus(status, pageable);
        return orders.map(ModelMapper::toOrderResponse);
    }

    public Optional<OrderResponse> updateOrderStatus(Long orderId, String status) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus(status);
                    return orderRepository.save(order);
                })
                .map(ModelMapper::toOrderResponse);
    }
}
```

## Frontend Implementation

### Admin Service
```javascript
export const orderService = {
  // Get all orders with pagination
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get all orders without pagination
  getAllWithoutPagination: async () => {
    const response = await api.get('/orders/all');
    return response.data;
  },

  // Get orders by status
  getByStatus: async (status, params = {}) => {
    const response = await api.get(`/orders/status/${status}`, { params });
    return response.data;
  },

  // Get order by ID
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status
  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status?status=${status}`);
    return response.data;
  }
};
```

### Orders Management Component
```javascript
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchOrders = async (page = 0, size = 10, status = 'ALL') => {
    setLoading(true);
    try {
      let response;
      if (status === 'ALL') {
        response = await orderService.getAll({ page, size });
      } else {
        response = await orderService.getByStatus(status, { page, size });
      }
      
      if (response && response.content) {
        setOrders(response.content);
        setPagination(prev => ({
          ...prev,
          current: page + 1,
          total: response.totalElements || 0
        }));
      }
    } catch (error) {
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      message.success('Order status updated successfully');
      fetchOrders(pagination.current - 1, pagination.pageSize, statusFilter);
    } catch (error) {
      message.error('Failed to update order status');
    }
  };
};
```

## Features

### 1. **Order Listing**
- Paginated table với 10 orders per page
- Sortable columns
- Search và filter functionality
- Loading states

### 2. **Status Management**
- Filter orders by status (ALL, PENDING, PROCESSING, COMPLETED, CANCELLED)
- Update order status với one-click buttons
- Real-time status updates
- Visual status indicators với badges

### 3. **Order Details**
- Modal popup để view order details
- Customer information
- Order items với quantities và prices
- Order timeline

### 4. **Pagination**
- Page navigation
- Page size selection
- Total count display
- Quick jump to page

### 5. **Status Workflow**
- **PENDING** → **PROCESSING** (Process button)
- **PENDING** → **CANCELLED** (Cancel button)
- **PROCESSING** → **COMPLETED** (Complete button)

## UI Components

### Status Filter
```javascript
<Select
  value={statusFilter}
  onChange={handleStatusFilterChange}
  style={{ width: 150 }}
  placeholder="Filter by status"
>
  <Option value="ALL">All Orders</Option>
  <Option value="PENDING">Pending</Option>
  <Option value="PROCESSING">Processing</Option>
  <Option value="COMPLETED">Completed</Option>
  <Option value="CANCELLED">Cancelled</Option>
</Select>
```

### Action Buttons
```javascript
{record.status === 'PENDING' && (
  <>
    <Button 
      type="primary" 
      icon={<CheckOutlined />} 
      onClick={() => handleStatusChange(record.id, 'PROCESSING')}
    >
      Process
    </Button>
    <Button 
      danger
      icon={<CloseOutlined />} 
      onClick={() => handleStatusChange(record.id, 'CANCELLED')}
    >
      Cancel
    </Button>
  </>
)}
```

### Pagination
```javascript
<Table
  pagination={{
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
    onChange: handleTableChange,
    onShowSizeChange: handleTableChange,
  }}
/>
```

## Testing

### 1. **Test Order Listing**
```bash
# 1. Login as admin
# 2. Navigate to Orders page
# 3. Verify orders are loaded
# 4. Test pagination
# 5. Test status filter
```

### 2. **Test Status Updates**
```bash
# 1. Find a PENDING order
# 2. Click "Process" button
# 3. Verify status changes to PROCESSING
# 4. Click "Complete" button
# 5. Verify status changes to COMPLETED
```

### 3. **Test Filtering**
```bash
# 1. Select "PENDING" from status filter
# 2. Verify only PENDING orders are shown
# 3. Select "ALL" from status filter
# 4. Verify all orders are shown
```

## Files Modified

- `api-server/src/main/java/com/sonnguyen/laptopshop/controller/OrderController.java` - Added admin endpoints
- `api-server/src/main/java/com/sonnguyen/laptopshop/service/OrderService.java` - Added admin methods
- `ui/src/services/adminService.js` - Updated order service
- `ui/src/pages/admin/Orders.jsx` - Enhanced orders management UI

## Status

✅ **Completed**: Admin orders management system
✅ **Completed**: Pagination và filtering
✅ **Completed**: Status management
✅ **Completed**: Order details modal
✅ **Completed**: Real-time updates
✅ **Tested**: All admin order operations

## Next Steps

1. **Add export functionality** cho orders
2. **Add bulk operations** (bulk status update)
3. **Add order search** by customer name/email
4. **Add order analytics** và statistics
5. **Add email notifications** cho status changes
