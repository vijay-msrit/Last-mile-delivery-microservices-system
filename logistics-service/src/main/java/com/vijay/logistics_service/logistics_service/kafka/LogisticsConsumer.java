package com.vijay.logistics_service.logistics_service.kafka;

import com.vijay.logistics_service.logistics_service.Client.DriverClient;
import com.vijay.logistics_service.logistics_service.Client.OrderClient;
import com.vijay.logistics_service.logistics_service.dto.DriverAssignedEvent;
import com.vijay.logistics_service.logistics_service.dto.DriverDTO;
import com.vijay.logistics_service.logistics_service.dto.OrderCreatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogisticsConsumer {

    private final DriverClient driverClient;
    private final OrderClient orderClient;
    private final LogisticsProducer producer;

    public LogisticsConsumer(DriverClient driverClient,
                             OrderClient orderClient,
                             LogisticsProducer producer) {
        this.driverClient = driverClient;
        this.orderClient = orderClient;
        this.producer = producer;
    }

    @KafkaListener(topics = "order-created", groupId = "logistics-group")
    public void handleOrderCreated(OrderCreatedEvent event) {

        List<DriverDTO> availableDrivers = driverClient.getAvailableDrivers();

        if (availableDrivers.isEmpty()) {
            return; // No driver available
        }

        DriverDTO selectedDriver = availableDrivers.get(0);
        orderClient.assignDriver(event.getOrderId(), selectedDriver.getId());
        DriverAssignedEvent assignedEvent =
                new DriverAssignedEvent(event.getOrderId(), selectedDriver.getId());

        producer.publishDriverAssignedEvent(assignedEvent);
    }
}
