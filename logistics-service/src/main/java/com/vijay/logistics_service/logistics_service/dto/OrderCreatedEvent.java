package com.vijay.logistics_service.logistics_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderCreatedEvent {

    private Long orderId;
    private Long userId;
    private String pickupAddress;
    private Long driverId;
    private String status;
}