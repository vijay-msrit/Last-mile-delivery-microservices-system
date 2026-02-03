package com.example.notification_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreatedEvent {

    private Long orderId;
    private Long userId;
    private String pickupAddress;
    private Long driverId;
    private String status;
}
