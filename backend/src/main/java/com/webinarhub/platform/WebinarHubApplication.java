package com.webinarhub.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableScheduling
public class WebinarHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebinarHubApplication.class, args);
    }
}
