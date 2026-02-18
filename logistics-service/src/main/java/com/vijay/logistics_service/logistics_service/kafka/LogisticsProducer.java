package com.vijay.logistics_service.logistics_service.kafka;

import com.vijay.logistics_service.logistics_service.dto.DriverAssignedEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class LogisticsProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public LogisticsProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishDriverAssignedEvent(DriverAssignedEvent event) {
        kafkaTemplate.send("driver-assigned", event);
    }
}
