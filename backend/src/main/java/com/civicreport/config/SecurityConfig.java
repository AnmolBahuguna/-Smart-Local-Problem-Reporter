package com.civicreport.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/categories", "/api/statuses").permitAll()
                .requestMatchers("/api/complaints/**").permitAll()
                .requestMatchers("/api/admin/**").permitAll()
                .requestMatchers("/", "/index.html", "/auth.html", "/dashboard.html",
                                 "/report.html", "/complaints.html", "/admin.html",
                                 "/css/**", "/js/**", "/assets/**", "/uploads/**").permitAll()
                .anyRequest().permitAll()
            );

        return http.build();
    }
}

