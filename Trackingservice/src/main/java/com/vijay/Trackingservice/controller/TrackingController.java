package com.vijay.Trackingservice.controller;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tracking")
public class TrackingController {

    private final StringRedisTemplate redis;

    public TrackingController(StringRedisTemplate redis) {
        this.redis = redis;
    }

    @GetMapping("/{driverId}")
    public String getLocation(@PathVariable Long driverId) {
        return redis.opsForValue().get("driver:" + driverId);
    }
}
