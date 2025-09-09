package com.libtrack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AppConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // You can add other global beans here, like ModelMapper or RestTemplate
    // @Bean
    // public ModelMapper modelMapper() {
    //     return new ModelMapper();
    // }
}