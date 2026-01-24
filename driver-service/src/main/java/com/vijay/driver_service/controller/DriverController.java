package com.vijay.driver_service.controller;

import com.vijay.driver_service.dto.DriverResponse;
import com.vijay.driver_service.entity.Driver;
import com.vijay.driver_service.service.DriverService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {
    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @PostMapping("/register")
    public ResponseEntity<DriverResponse> register(@RequestBody Driver driver) {
        return ResponseEntity.ok(driverService.registerDriver(driver));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DriverResponse> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.toggleStatus(id));
    }

    @PatchMapping("/{id}/location")
    public ResponseEntity<DriverResponse> updateLocation(
            @PathVariable Long id,
            @RequestParam Double lat,
            @RequestParam Double lng) {
        return ResponseEntity.ok(driverService.updateLocation(id, lat, lng));
    }

    @GetMapping("/available")
    public ResponseEntity<List<DriverResponse>> getAvailable() {
        return ResponseEntity.ok(driverService.getAvailableDrivers());
    }
}