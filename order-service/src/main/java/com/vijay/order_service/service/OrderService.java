package com.vijay.order_service.service;

import com.vijay.order_service.client.DriverClient;
import com.vijay.order_service.dto.DriverDTO;
import com.vijay.order_service.dto.OrderRequest;
import com.vijay.order_service.entity.Order;
import com.vijay.order_service.entity.OrderStatus;
import com.vijay.order_service.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final DriverClient driverClient;   // Feign Client

    public OrderService(OrderRepository orderRepository, DriverClient driverClient) {
        this.orderRepository = orderRepository;
        this.driverClient = driverClient;
    }
    public Order createOrder(OrderRequest request) {

        Order order = Order.builder()
                .userId(request.getUserId())
                .pickupAddress(request.getPickupAddress())
                .deliveryAddress(request.getDeliveryAddress())
                .createdAt(LocalDateTime.now())
                .build();
        List<DriverDTO> availableDrivers = driverClient.getAvailableDrivers();

        if (availableDrivers.isEmpty()) {
            order.setStatus(OrderStatus.PENDING);
        } else {

            DriverDTO driver = availableDrivers.get(0);
            order.setStatus(OrderStatus.ASSIGNED);
            order.setDriverId(driver.getId());
        }

        return orderRepository.save(order);
    }
    public Order updateStatus(Long id, OrderStatus newStatus) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (newStatus == OrderStatus.DELIVERED &&
                order.getStatus() != OrderStatus.PICKED_UP) {
            throw new RuntimeException("Cannot deliver an order that hasn't been picked up!");
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    public Order getOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}
