package com.vijay.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private Long userId;            // The customer ID
    private String pickupAddress;   // Where the driver goes first
    private String deliveryAddress; // The final destination
}