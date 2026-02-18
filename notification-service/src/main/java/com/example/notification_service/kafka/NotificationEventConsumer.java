package com.example.notification_service.kafka;

import com.example.notification_service.websocket.NotificationSocketHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationEventConsumer {

    private final NotificationSocketHandler socketHandler;

    public NotificationEventConsumer(NotificationSocketHandler socketHandler) {
        this.socketHandler = socketHandler;
    }

    @KafkaListener(topics = "order-created", groupId = "notification-group")
    public void consumeOrderCreated(String message) throws Exception {
        System.out.println("Order Created Event: " + message);
        socketHandler.broadcast("ORDER_CREATED: " + message);
    }

    @KafkaListener(topics = "driver-assigned", groupId = "notification-group")
    public void consumeDriverAssigned(String message) throws Exception {
        System.out.println("Driver Assigned Event: " + message);
        socketHandler.broadcast("DRIVER_ASSIGNED: " + message);
    }

    @KafkaListener(topics = "order-picked-up", groupId = "notification-group")
    public void consumeOrderPickedUp(String message) throws Exception {
        System.out.println("Order Picked Up Event: " + message);
        socketHandler.broadcast("ORDER_PICKED_UP: " + message);
    }

    @KafkaListener(topics = "order-delivered", groupId = "notification-group")
    public void consumeOrderDelivered(String message) throws Exception {
        System.out.println("Order Delivered Event: " + message);
        socketHandler.broadcast("ORDER_DELIVERED: " + message);
    }
}

