package com.Campmate.DYCampmate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "admins", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
public class AdminEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 255)
    private String address;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(length = 255)
    private String description;

    @Column(nullable = false, name = "camping_style")
    private String campingStyle;

    @Column(nullable = false, name = "camping_background")
    private String campingBackground;

    @Column(nullable = false, name = "camping_type")
    private String campingType;

    @Column(name = "create_dt", updatable = false)
    private LocalDateTime createDt;

    /**
     * 정보 수정을 위한 update 메서드 (필요한 필드만 업데이트하도록 변경 가능)
     */
    public void update(String email, String name, String description, String campingStyle, String campingBackground, String campingType, String address, String imageUrl) {
        if (email != null) this.email = email;
        if (name != null) this.name = name;
        if (description != null) this.description = description;
        if (campingStyle != null) this.campingStyle = campingStyle;
        if (campingBackground != null) this.campingBackground = campingBackground;
        if (campingType != null) this.campingType = campingType;
        if (address != null) this.address = address;
        if (imageUrl != null) this.imageUrl = imageUrl;
    }
}