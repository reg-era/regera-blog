package com.backend.blog;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.backend.blog.entities.User;
import com.backend.blog.repositories.UserRepository;

@SpringBootApplication
public class BlogApplication {

	public static void main(String[] args) {
		SpringApplication.run(BlogApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(UserRepository userRepository) {
		return args -> {
			if (!userRepository.existsByUsername("admin")) {
				userRepository.save(User.createAdmin());
				System.out.println("✅ Default admin created: admin/root123");
			}
		};
	}
}
