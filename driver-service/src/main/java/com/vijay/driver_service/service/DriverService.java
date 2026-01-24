package com.vijay.driver_service.service;

import com.vijay.driver_service.dto.DriverResponse;
import com.vijay.driver_service.entity.Driver;
import com.vijay.driver_service.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DriverService {
    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    // Helper: Entity -> DTO
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
        return mapToResponse(driverRepository.save(driver));
    }

    public List<DriverResponse> getAvailableDrivers() {
        return driverRepository.findByAvailableTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}