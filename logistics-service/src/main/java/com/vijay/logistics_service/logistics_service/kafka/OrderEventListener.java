package com.vijay.logistics_service.logistics_service.kafka;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vijay.logistics_service.logistics_service.Client.DriverClient;
import com.vijay.logistics_service.logistics_service.Client.OrderClient;
import com.vijay.logistics_service.logistics_service.dto.DriverDTO;
import com.vijay.logistics_service.logistics_service.dto.OrderCreatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderEventListener {

    private final DriverClient driverClient;
    private final OrderClient orderClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public OrderEventListener(DriverClient driverClient, OrderClient orderClient) {
        this.driverClient = driverClient;
        this.orderClient = orderClient;
    }

    @KafkaListener(topics = "order-created", groupId = "logistics-group")
    public void dispatch(String message) throws Exception {

        OrderCreatedEvent event =
                mapper.readValue(message, OrderCreatedEvent.class);

        // Only process PENDING orders
        if (!"PENDING".equals(event.getStatus())) return;

        List<DriverDTO> drivers = driverClient.getAvailableDrivers();

        if (!drivers.isEmpty()) {
            DriverDTO driver = drivers.get(0);

            // Call Order Service
            orderClient.assignDriver(event.getOrderId(), driver.getId());

            System.out.println("Assigned driver " + driver.getId()
                    + " to order " + event.getOrderId());
        }
    }

}