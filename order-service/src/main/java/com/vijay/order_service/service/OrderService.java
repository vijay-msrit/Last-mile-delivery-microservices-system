package com.vijay.order_service.service;

import com.vijay.order_service.dto.OrderRequest;
import com.vijay.order_service.entity.Order;
import com.vijay.order_service.entity.OrderStatus;
import com.vijay.order_service.event.OrderCreatedEvent;
import com.vijay.order_service.kafka.OrderEventProducer;
import com.vijay.order_service.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderEventProducer eventProducer;

    public OrderService(OrderRepository orderRepository,
                        OrderEventProducer eventProducer) {
        this.orderRepository = orderRepository;
        this.eventProducer = eventProducer;
    }

    // Create order (NO driver logic here)
    public Order createOrder(OrderRequest request) {

        Order order = Order.builder()
                .userId(request.getUserId())
                .pickupAddress(request.getPickupAddress())
                .deliveryAddress(request.getDeliveryAddress())
                .status(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        Order saved = orderRepository.save(order);

        // Kafka event
        OrderCreatedEvent event = new OrderCreatedEvent(
                saved.getId(),
                saved.getUserId(),
                saved.getPickupAddress(),
                saved.getDriverId(),          // null at this time
                saved.getStatus().name()      // PENDING
        );

        eventProducer.publish(event);

        return saved;
    }


    // Assign driver (called by Logistics Service)
    public Order assignDriver(Long id, Long driverId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setDriverId(driverId);
        order.setStatus(OrderStatus.ASSIGNED);

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
