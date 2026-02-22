package com.vijay.logistics_service.logistics_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
@EnableDiscoveryClient
public class LogisticsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LogisticsServiceApplication.class, args);
	}

}
