package com.vijay.Trackingservice.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vijay.Trackingservice.dto.GpsEvent;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class GpsEventListener {

    private final StringRedisTemplate redis;
    private final ObjectMapper mapper = new ObjectMapper();

    public GpsEventListener(StringRedisTemplate redis) {
        this.redis = redis;
    }

    @KafkaListener(topics = "driver-gps", groupId = "tracking-group")
    public void consume(String msg) throws Exception {
        GpsEvent gps = mapper.readValue(msg, GpsEvent.class);
        redis.opsForValue().set(
                "driver:" + gps.getDriverId(),
                gps.getLat() + "," + gps.getLng()
        );
    }
}
