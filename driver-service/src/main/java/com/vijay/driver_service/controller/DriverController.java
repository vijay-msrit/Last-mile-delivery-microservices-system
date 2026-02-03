package com.vijay.driver_service.controller;

import com.vijay.driver_service.dto.DriverResponse;
import com.vijay.driver_service.dto.GpsEvent;
import com.vijay.driver_service.entity.Driver;
import com.vijay.driver_service.kafka.GpsEventProducer;
import com.vijay.driver_service.service.DriverService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {
    private final DriverService driverService;
    private final GpsEventProducer gpsEventProducer;

    public DriverController(DriverService driverService,GpsEventProducer gpsEventProducer) {
        this.driverService = driverService;
        this.gpsEventProducer = gpsEventProducer;
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
    @PostMapping("/{id}/gps")
    public ResponseEntity<String> sendGps(@PathVariable Long id,
                                          @RequestParam double lat,
                                          @RequestParam double lng) throws Exception {

        gpsEventProducer.send(new GpsEvent(id, lat, lng));
        return ResponseEntity.ok("GPS sent to Kafka");
    }
    @GetMapping("/available")
    public ResponseEntity<List<DriverResponse>> getAvailable() {
        return ResponseEntity.ok(driverService.getAvailableDrivers());
    }
}