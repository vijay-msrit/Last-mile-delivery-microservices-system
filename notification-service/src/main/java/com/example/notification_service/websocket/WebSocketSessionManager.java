package com.example.notification_service.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketSessionManager {

    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();

    public void add(WebSocketSession session) {
        sessions.add(session);
    }

    public void remove(WebSocketSession session) {
        sessions.remove(session);
    }

    public void broadcast(String msg) {
        sessions.forEach(s -> {
            try {
                s.sendMessage(new TextMessage(msg));
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }
}
