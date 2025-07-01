package com.Campmate.DYCampmate.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.time.LocalDateTime;
import java.util.Optional;

@Entity
@Table(name = "admins", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
public class AdminEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;  // int(15) → Integer

    @Setter
    @Column(nullable = false, length = 255, unique = true)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, name = "camping_style", length = 255)
    private String camping_style;

    @Column(nullable = false, name = "camping_background", length = 255)
    private String camping_background;

    @Column(nullable = false, name = "camping_type", length = 255)
    private String camping_type;

    @Column(name = "create_dt")
    private LocalDateTime create_dt;


    // 기본 생성자
    public AdminEntity() {}



    // 전체 생성자
    public AdminEntity(String email, String password, String name, String camping_Style,
                 String camping_background, String camping_type, LocalDateTime create_dt) {

        this.email = email;
        this.password = password;
        this.name = name;
        this.camping_style = camping_Style;
        this.camping_background = camping_background;
        this.camping_type = camping_type;
        this.create_dt = create_dt;
    }



}