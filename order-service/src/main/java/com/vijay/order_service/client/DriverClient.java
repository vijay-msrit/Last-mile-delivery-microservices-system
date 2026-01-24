package com.vijay.order_service.client;

import com.vijay.order_service.dto.DriverDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@FeignClient(name = "driver-service", url = "http://localhost:8082")
public interface DriverClient {

    @GetMapping("/api/drivers/available")
    List<DriverDTO> getAvailableDrivers();
}
