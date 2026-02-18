package com.vijay.driver_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDeliveredEvent {

    private Long orderId;
    private Long driverId;
}
