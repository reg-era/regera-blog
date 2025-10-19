package com.backend.blog.config;

import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Component
public class MediaConfig implements WebMvcConfigurer {

    @Value("${app.media.path}")
    private String mediaPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        String absolutePath = Paths.get(mediaPath).toAbsolutePath().toUri().toString();;
        System.out.println("Media directory absolute path: " + absolutePath);

        registry.addResourceHandler("/media/**")
                .addResourceLocations(absolutePath);
    }

}
