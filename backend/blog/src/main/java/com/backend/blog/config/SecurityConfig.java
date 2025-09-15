package com.backend.blog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        .requestMatchers("/").permitAll()
                        .requestMatchers("/api/users/**").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/**").hasRole("BLOGGER")
                        .requestMatchers(HttpMethod.PUT, "/api/**").hasRole("BLOGGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("BLOGGER")

                        .requestMatchers(HttpMethod.GET, "/api/notification").hasRole("BLOGGER")
                        .requestMatchers(HttpMethod.GET, "/api/**").permitAll()

                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
