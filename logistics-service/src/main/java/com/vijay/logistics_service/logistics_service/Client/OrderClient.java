package com.vijay.logistics_service.logistics_service.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "order-service", url = "http://localhost:8081")
public interface OrderClient {

    @PatchMapping("/api/orders/{id}/assign")
    void assignDriver(@PathVariable Long id,
                      @RequestParam Long driverId);
}
