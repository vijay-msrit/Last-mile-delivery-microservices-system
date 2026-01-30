package com.vijay.order_service.controller;

import com.vijay.order_service.dto.OrderRequest;
import com.vijay.order_service.entity.Order;
import com.vijay.order_service.entity.OrderStatus;
import com.vijay.order_service.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request) {

        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<Order> assignDriver(@PathVariable Long id,
                                              @RequestParam Long driverId) {
        return ResponseEntity.ok(orderService.assignDriver(id, driverId));
    }


    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

}