package com.example.notification_service.kafka;

import com.example.notification_service.websocket.NotificationSocketHandler;
import com.example.notification_service.websocket.WebSocketSessionManager;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
public class OrderEventConsumer {

    private final NotificationSocketHandler socketHandler;

    public OrderEventConsumer(NotificationSocketHandler socketHandler) {
        this.socketHandler = socketHandler;
    }

    @KafkaListener(topics = "order-created", groupId = "notification-group")
    public void consume(String message) throws Exception {
        System.out.println(" Notification Event: " + message);
        socketHandler.broadcast(message);
    }
}

