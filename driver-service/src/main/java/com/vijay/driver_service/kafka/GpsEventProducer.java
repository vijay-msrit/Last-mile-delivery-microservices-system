package com.vijay.driver_service.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vijay.driver_service.dto.GpsEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class GpsEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper mapper = new ObjectMapper();

    public GpsEventProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void send(GpsEvent gps) throws Exception {
        String json = mapper.writeValueAsString(gps);
        kafkaTemplate.send("driver-gps", json);
    }
}
