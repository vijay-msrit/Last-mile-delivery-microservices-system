package com.vijay.driver_service.service;

import com.vijay.driver_service.dto.*;
import com.vijay.driver_service.entity.Driver;
import com.vijay.driver_service.kafka.DriverEventProducer;
import com.vijay.driver_service.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DriverService {
    private final DriverRepository driverRepository;
    private final DriverEventProducer producer;

    public DriverService(DriverRepository driverRepository,
                         DriverEventProducer producer) {
        this.driverRepository = driverRepository;
        this.producer = producer;
    }
    private DriverResponse mapToResponse(Driver driver) {
        return DriverResponse.builder()
                .id(driver.getId())
                .name(driver.getName())
                .vehicleNumber(driver.getVehicleNumber())
                .lastLat(driver.getLastLat())
                .lastLng(driver.getLastLng())
                .available(driver.getAvailable())
                .build();
    }
    public DriverResponse registerDriver(Driver driver) {
        driver.setAvailable(false);
        return mapToResponse(driverRepository.save(driver));
    }
    public DriverResponse toggleStatus(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        driver.setAvailable(!driver.getAvailable());
        return mapToResponse(driverRepository.save(driver));
    }
    public DriverResponse updateLocation(Long id, Double lat, Double lng) {

        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        driver.setLastLat(lat);
        driver.setLastLng(lng);
        driverRepository.save(driver);

        GpsEvent event =
                new GpsEvent(id, lat, lng);

        producer.publishLocation(event);

        return mapToResponse(driver);
    }

    // Driver picks up order
    public void markOrderPickedUp(Long orderId, Long driverId) {

        OrderPickedUpEvent event =
                new OrderPickedUpEvent(orderId, driverId);

        producer.publishPickedUp(event);
    }
    public void markOrderDelivered(Long orderId, Long driverId) {

        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        driver.setAvailable(true);
        driverRepository.save(driver);

        OrderDeliveredEvent event =
                new OrderDeliveredEvent(orderId, driverId);

        producer.publishDelivered(event);
    }
    public List<DriverResponse> getAvailableDrivers() {
        return driverRepository.findByAvailableTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}
