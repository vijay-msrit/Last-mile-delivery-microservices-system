package com.vijay.order_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DriverDTO {

    private Long id;
    private String name;
    private boolean available;
}
