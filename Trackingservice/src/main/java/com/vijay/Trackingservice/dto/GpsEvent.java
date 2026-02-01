package com.vijay.Trackingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GpsEvent {
    private Long driverId;
    private double lat;
    private double lng;
}
