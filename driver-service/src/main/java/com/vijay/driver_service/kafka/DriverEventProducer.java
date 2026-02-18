package com.vijay.driver_service.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class DriverEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public DriverEventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishPickedUp(Object event) {
        kafkaTemplate.send("order-picked-up", event);
    }

    public void publishDelivered(Object event) {
        kafkaTemplate.send("order-delivered", event);
    }

    public void publishLocation(Object event) {
        kafkaTemplate.send("driver-location-updated", event);
    }
}
