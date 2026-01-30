package com.vijay.driver_service.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vijay.driver_service.entity.Driver;
import com.vijay.driver_service.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OrderEventConsumer {
    private final DriverRepository driverRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();


    public OrderEventConsumer(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    @KafkaListener(topics = "order-created", groupId = "driver-service-group")
    public void consume(String message) throws Exception {

        System.out.println(" Kafka Event Received: " + message);

        OrderCreatedEvent event = objectMapper.readValue(message, OrderCreatedEvent.class);

        Optional<Driver> driverOpt = driverRepository.findById(event.getDriverId());

        if (driverOpt.isPresent()) {
            Driver driver = driverOpt.get();
            driver.setAvailable(false);
            driverRepository.save(driver);

            System.out.println("Driver " + driver.getId() + " marked BUSY for order " + event.getOrderId());
        }
    }
}
