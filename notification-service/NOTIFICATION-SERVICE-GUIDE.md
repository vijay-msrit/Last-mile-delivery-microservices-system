# 📢 Notification Service - Complete Interview Guide

## 🎯 Service Overview

The **Notification Service** is a real-time notification microservice that:
1. **Consumes events from Kafka** (Event-Driven Architecture)
2. **Broadcasts notifications via WebSocket** to connected clients in real-time
3. Acts as a **bridge** between backend events and frontend UI

---

## 📁 Project Structure

```
notification-service/
├── pom.xml                           # Maven dependencies
├── src/main/resources/
│   └── application.properties        # Configuration
└── src/main/java/com/example/notification_service/
    ├── NotificationServiceApplication.java   # Entry point
    ├── config/
    │   ├── KafkaConsumerConfig.java          # Kafka configuration
    │   └── WebSocketConfig.java              # WebSocket configuration
    ├── dto/
    │   └── OrderCreatedEvent.java            # Data Transfer Object
    ├── kafka/
    │   └── NotificationEventConsumer.java    # Kafka message listener
    ├── model/
    │   └── NotificationMessage.java          # Entity model
    └── websocket/
        └── NotificationSocketHandler.java    # WebSocket handler
```

---

## 📄 File-by-File Explanation

---

### 1️⃣ `pom.xml` - Maven Build Configuration

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.vijay</groupId>
    <artifactId>notification-service</artifactId>
    <version>0.0.1</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
    </parent>

    <properties>
        <java.version>21</java.version>
    </properties>

    <dependencies>
        <!-- Kafka for event consumption -->
        <dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka</artifactId>
        </dependency>

        <!-- WebSocket for real-time communication -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-websocket</artifactId>
        </dependency>

        <!-- Web starter for HTTP -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Lombok for boilerplate reduction -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>
```

**Interview Points:**
- **spring-kafka**: Provides `@KafkaListener` annotation for consuming messages
- **spring-boot-starter-websocket**: Enables WebSocket support for real-time bidirectional communication
- **spring-boot-starter-web**: Required for HTTP server and REST endpoints
- **lombok**: Reduces boilerplate code (getters, setters, constructors)

---

### 2️⃣ `application.properties` - Configuration

```properties
spring.application.name=notification-service
server.port=8086

# Kafka Configuration
spring.kafka.bootstrap-servers=kafka:9092
spring.kafka.consumer.group-id=notification-group
spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.auto-offset-reset=latest
```

**Interview Points:**
| Property | Purpose |
|----------|---------|
| `server.port=8086` | Service runs on port 8086 |
| `bootstrap-servers=kafka:9092` | Kafka broker address (Docker service name) |
| `group-id=notification-group` | Consumer group ID for load balancing |
| `key/value-deserializer` | Converts Kafka bytes → Java String |
| `auto-offset-reset=latest` | Start reading from newest messages (not old ones) |

**Consumer Group Concept:**
> If you have 3 instances of notification-service with the same `group-id`, Kafka will distribute messages among them (load balancing). Each message is processed by only ONE instance.

---

### 3️⃣ `NotificationServiceApplication.java` - Main Entry Point

```java
package com.example.notification_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NotificationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }
}
```

**Interview Points:**
- `@SpringBootApplication` = `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`
- **Auto-Configuration**: Spring automatically configures Kafka, WebSocket based on dependencies
- **Component Scan**: Finds all `@Component`, `@Service`, `@Configuration` classes in the package

---

### 4️⃣ `config/KafkaConsumerConfig.java` - Kafka Configuration

```java
package com.example.notification_service.config;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "notification-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String,String> kafkaListenerContainerFactory() {
        var factory = new ConcurrentKafkaListenerContainerFactory<String,String>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }
}
```

**Interview Points:**

| Annotation/Class | Purpose |
|------------------|---------|
| `@Configuration` | Marks this as a Spring configuration class |
| `@EnableKafka` | Enables Kafka listener annotations |
| `@Bean` | Registers the method's return value as a Spring bean |
| `ConsumerFactory` | Creates Kafka consumers with specified configuration |
| `ConcurrentKafkaListenerContainerFactory` | Factory that creates listener containers for `@KafkaListener` |

**Why ConcurrentKafkaListenerContainerFactory?**
> It enables **concurrent message processing**. If you have multiple partitions, it can process messages in parallel using multiple threads.

---

### 5️⃣ `config/WebSocketConfig.java` - WebSocket Configuration

```java
package com.example.notification_service.config;

import com.example.notification_service.websocket.NotificationSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final NotificationSocketHandler handler;

    public WebSocketConfig(NotificationSocketHandler handler) {
        this.handler = handler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(handler, "/ws/notify").setAllowedOrigins("*");
    }
}
```

**Interview Points:**

| Element | Purpose |
|---------|---------|
| `@EnableWebSocket` | Enables WebSocket support in Spring |
| `WebSocketConfigurer` | Interface to configure WebSocket handlers |
| `registerWebSocketHandlers()` | Registers handler at endpoint `/ws/notify` |
| `setAllowedOrigins("*")` | Allows connections from any domain (CORS) |

**WebSocket Endpoint:**
> Clients connect to `ws://localhost:8086/ws/notify` to receive real-time notifications

---

### 6️⃣ `websocket/NotificationSocketHandler.java` - WebSocket Handler

```java
package com.example.notification_service.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class NotificationSocketHandler extends TextWebSocketHandler {

    // Thread-safe set to store active WebSocket sessions
    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        System.out.println("Client connected: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        System.out.println("Client disconnected: " + session.getId());
    }

    public void broadcast(String message) throws IOException {
        System.out.println("Broadcasting to " + sessions.size() + " clients: " + message);
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(message));
            }
        }
    }
}
```

**Interview Points:**

| Element | Purpose |
|---------|---------|
| `TextWebSocketHandler` | Base class for handling text-based WebSocket messages |
| `ConcurrentHashMap.newKeySet()` | **Thread-safe** Set (important for concurrent access) |
| `afterConnectionEstablished()` | Called when a client connects |
| `afterConnectionClosed()` | Called when a client disconnects |
| `broadcast()` | Sends message to ALL connected clients |

**Why ConcurrentHashMap?**
> Multiple threads (Kafka listeners) may call `broadcast()` simultaneously. A regular `HashSet` would cause `ConcurrentModificationException`. `ConcurrentHashMap.newKeySet()` is thread-safe.

**Flow:**
```
Client connects → afterConnectionEstablished() → session added to Set
Client disconnects → afterConnectionClosed() → session removed from Set
Kafka event arrives → broadcast() → message sent to all sessions
```

---

### 7️⃣ `kafka/NotificationEventConsumer.java` - Kafka Consumer

```java
package com.example.notification_service.kafka;

import com.example.notification_service.websocket.NotificationSocketHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationEventConsumer {

    private final NotificationSocketHandler socketHandler;

    // Constructor Injection (Dependency Injection)
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
```

**Interview Points:**

| Element | Purpose |
|---------|---------|
| `@Service` | Marks as a Spring service bean |
| `@KafkaListener` | Subscribes to a Kafka topic |
| `topics = "order-created"` | Topic name to listen to |
| `groupId = "notification-group"` | Consumer group for load balancing |

**Topics Consumed:**
| Topic | Event | When Triggered |
|-------|-------|----------------|
| `order-created` | New order placed | Customer places order |
| `driver-assigned` | Driver assigned to order | Logistics assigns driver |
| `order-picked-up` | Driver picked up order | Driver picks up package |
| `order-delivered` | Order delivered | Driver delivers package |

**How @KafkaListener Works:**
1. Spring Kafka creates a listener container
2. Container polls Kafka for new messages
3. When message arrives, the annotated method is invoked
4. Method processes message and broadcasts via WebSocket

---

### 8️⃣ `dto/OrderCreatedEvent.java` - Data Transfer Object

```java
package com.example.notification_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreatedEvent {
    private Long orderId;
    private Long userId;
    private String pickupAddress;
    private Long driverId;
    private String status;
}
```

**Interview Points:**
- **DTO Pattern**: Used to transfer data between layers/services
- **Lombok Annotations**: Auto-generate boilerplate code at compile time
  - `@Getter` → generates `getOrderId()`, `getUserId()`, etc.
  - `@Setter` → generates `setOrderId()`, `setUserId()`, etc.
  - `@NoArgsConstructor` → generates empty constructor
  - `@AllArgsConstructor` → generates constructor with all fields

---

### 9️⃣ `model/NotificationMessage.java` - Model Class

```java
package com.example.notification_service.model;

public class NotificationMessage {
    private Long orderId;
    private String status;
    private String message;
}
```

**Interview Points:**
- Simple POJO for internal notification structure
- Can be used for future enhancements (database storage, templating)

---

## 🔄 Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NOTIFICATION SERVICE FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌─────────────────────────────────────┐
│ Order Service│    │Driver Service│    │         Logistics Service           │
│              │    │              │    │                                     │
│ Creates Order│    │ Picks Up     │    │ Assigns Driver                      │
│              │    │ Delivers     │    │                                     │
└──────┬───────┘    └──────┬───────┘    └──────────────────┬──────────────────┘
       │                   │                               │
       │ Publishes         │ Publishes                     │ Publishes
       │ "order-created"   │ "order-picked-up"             │ "driver-assigned"
       │                   │ "order-delivered"             │
       │                   │                               │
       ▼                   ▼                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              APACHE KAFKA                                    │
│  ┌─────────────┐ ┌────────────────┐ ┌───────────────┐ ┌───────────────────┐ │
│  │order-created│ │driver-assigned │ │order-picked-up│ │ order-delivered   │ │
│  └─────────────┘ └────────────────┘ └───────────────┘ └───────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 │ Consumes
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NOTIFICATION SERVICE                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │              NotificationEventConsumer (@KafkaListener)                │ │
│  │                                                                        │ │
│  │  consumeOrderCreated()    consumeDriverAssigned()                      │ │
│  │  consumeOrderPickedUp()   consumeOrderDelivered()                      │ │
│  └───────────────────────────────────┬────────────────────────────────────┘ │
│                                      │                                      │
│                                      │ Calls broadcast()                    │
│                                      ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │               NotificationSocketHandler (WebSocket)                    │ │
│  │                                                                        │ │
│  │   sessions = [session1, session2, session3, ...]                       │ │
│  │                                                                        │ │
│  │   broadcast() → sends message to ALL connected sessions                │ │
│  └───────────────────────────────────┬────────────────────────────────────┘ │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │
                                       │ WebSocket (ws://localhost:8086/ws/notify)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND CLIENTS                                   │
│                                                                             │
│   📱 Mobile App        💻 Web Dashboard        🖥️ Admin Panel              │
│                                                                             │
│   Receives real-time notifications:                                         │
│   • "ORDER_CREATED: {orderId: 1, userId: 5, ...}"                          │
│   • "DRIVER_ASSIGNED: {orderId: 1, driverId: 3}"                           │
│   • "ORDER_PICKED_UP: {orderId: 1, driverId: 3}"                           │
│   • "ORDER_DELIVERED: {orderId: 1, driverId: 3}"                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎤 Common Interview Questions & Answers

### Q1: Why use Kafka instead of REST calls?
**Answer:** 
- **Decoupling**: Services don't need to know about notification service
- **Async Processing**: Order service doesn't wait for notification to complete
- **Reliability**: Messages are persisted in Kafka even if notification service is down
- **Scalability**: Can add more consumers without changing producers

### Q2: Why use WebSocket instead of HTTP polling?
**Answer:**
- **Real-time**: Instant push notifications (no delay)
- **Efficient**: No repeated HTTP requests (reduces server load)
- **Bidirectional**: Server can push without client requesting
- **Persistent**: Single connection stays open

### Q3: Why ConcurrentHashMap instead of HashSet?
**Answer:**
- Multiple Kafka listener threads may call `broadcast()` simultaneously
- `HashSet` is not thread-safe → `ConcurrentModificationException`
- `ConcurrentHashMap.newKeySet()` provides thread-safe operations

### Q4: What happens if notification service is down?
**Answer:**
- Kafka retains messages (configurable retention period)
- When service restarts, it reads from last committed offset
- `auto-offset-reset=latest` → starts from newest messages
- Can change to `earliest` to process all unread messages

### Q5: How does Consumer Group work?
**Answer:**
- All consumers with same `groupId` form a group
- Kafka distributes partitions among group members
- Each message is processed by ONE consumer in the group
- Provides load balancing and fault tolerance

---

## 🏃 How to Test

1. **Start the service:**
   ```bash
   ./mvnw spring-boot:run
   ```

2. **Connect WebSocket client:**
   ```javascript
   const ws = new WebSocket('ws://localhost:8086/ws/notify');
   ws.onmessage = (event) => console.log('Notification:', event.data);
   ```

3. **Create an order** (in order-service) → You'll see:
   ```
   Notification: ORDER_CREATED: {"orderId":1,"userId":5,...}
   ```

---

## 📝 Summary for Interview

> "The Notification Service is an **event-driven microservice** that acts as a bridge between backend events and frontend clients. It **consumes Kafka messages** from topics like order-created, driver-assigned, order-picked-up, and order-delivered. When a message arrives, it **broadcasts via WebSocket** to all connected clients in real-time. I used **ConcurrentHashMap** for thread-safety, **@KafkaListener** for declarative message consumption, and **Spring WebSocket** for persistent connections."

