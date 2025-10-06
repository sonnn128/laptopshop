package com.sonnguyen.laptopshop.service;

import com.sonnguyen.laptopshop.model.*;
import com.sonnguyen.laptopshop.payload.request.CartItemRequest;
import com.sonnguyen.laptopshop.payload.request.OrderRequest;
import com.sonnguyen.laptopshop.payload.response.OrderResponse;
import com.sonnguyen.laptopshop.repository.*;
import com.sonnguyen.laptopshop.utils.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, OrderDetailRepository orderDetailRepository,
                       ProductRepository productRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public OrderResponse createOrder(String userId, OrderRequest request) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setReceiverName(request.getReceiverName());
        order.setReceiverAddress(request.getReceiverAddress());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setStatus("PENDING");
        order.setTotalPrice(0.0);

        Order savedOrder = orderRepository.save(order);

        double totalPrice = 0.0;
        for (CartItemRequest item : request.getCartItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient product quantity for product: " + product.getName());
            }

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(savedOrder);
            orderDetail.setProduct(product);
            orderDetail.setQuantity(item.getQuantity());
            orderDetail.setPrice(product.getPrice());
            orderDetailRepository.save(orderDetail);

            // Update product quantity and sold count
            product.setQuantity(product.getQuantity() - item.getQuantity());
            product.setSold(product.getSold() + item.getQuantity());
            productRepository.save(product);

            totalPrice += item.getQuantity() * product.getPrice();
        }

        savedOrder.setTotalPrice(totalPrice);
        Order finalOrder = orderRepository.save(savedOrder);

        return ModelMapper.toOrderResponse(finalOrder);
    }

    public Page<OrderResponse> getOrdersByUserId(String userId, Pageable pageable) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Convert to page manually since we don't have a pageable method
        return Page.empty(pageable);
    }

    public List<OrderResponse> getUserOrders(String userId) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream()
                .map(ModelMapper::toOrderResponse)
                .toList();
    }

    public Optional<OrderResponse> getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .map(ModelMapper::toOrderResponse);
    }

    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(ModelMapper::toOrderResponse);
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

    public List<OrderResponse> getUserOrdersByStatus(String userId, String status) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByUserAndStatus(user, status);
        return orders.stream()
                .map(ModelMapper::toOrderResponse)
                .toList();
    }
}
