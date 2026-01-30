package com.vijay.logistics_service.logistics_service.dto;

import lombok.Data;

@Data
public class DriverDTO {
    private Long id;
    private String name;
    private boolean available;
}