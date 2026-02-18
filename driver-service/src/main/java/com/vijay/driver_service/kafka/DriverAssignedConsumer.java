package com.vijay.driver_service.kafka;

import com.vijay.driver_service.dto.DriverAssignedEvent;
import com.vijay.driver_service.entity.Driver;
import com.vijay.driver_service.repository.DriverRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DriverAssignedConsumer {

    private final DriverRepository driverRepository;

    public DriverAssignedConsumer(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    @KafkaListener(topics = "driver-assigned", groupId = "driver-service-group")
    public void consume(DriverAssignedEvent event) {

        System.out.println(" Driver Assigned Event Received: " + event);

        Optional<Driver> driverOpt = driverRepository.findById(event.getDriverId());

        if (driverOpt.isPresent()) {
            Driver driver = driverOpt.get();
            driver.setAvailable(false);
            driverRepository.save(driver);

            System.out.println("Driver " + driver.getId() +
                    " marked BUSY for order " + event.getOrderId());
        }
    }
}
