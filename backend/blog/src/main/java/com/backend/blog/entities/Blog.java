package com.backend.blog.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="blogs")
public class Blog {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="author_id", nullable=false)
    private User author;

    @Column(nullable=false)
    private String title;

    @Column(nullable=false, columnDefinition="TEXT")
    private String content;

    @Column(columnDefinition="TIMESTAMP")
    private LocalDateTime createdAt = LocalDateTime.now();

}
