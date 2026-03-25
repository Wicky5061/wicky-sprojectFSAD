package com.webinarhub.platform.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Application configuration class demonstrating Spring IoC and DI.
 * The @Configuration annotation marks this as a source of bean definitions.
 * The @Bean annotation tells Spring to manage the returned object as a Spring bean.
 * This is an example of Inversion of Control - Spring container manages object lifecycle.
 */
@Configuration
public class AppConfig {

    /**
     * ModelMapper bean for DTO <-> Entity mapping.
     * Dependency Injection: This bean can be autowired anywhere in the application.
     */
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setSkipNullEnabled(true)
                .setAmbiguityIgnored(true);
        return modelMapper;
    }
}
