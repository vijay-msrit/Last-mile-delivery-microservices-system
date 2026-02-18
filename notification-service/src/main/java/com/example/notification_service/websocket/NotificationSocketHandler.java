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

    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        System.out.println("Client connected: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        System.out.println(" Client disconnected: " + session.getId());
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
