package com.Campmate.DYCampmate.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "camping_zones")
public class CampingZone extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admins_id", nullable = false)
    private AdminEntity admin;

    @Column(name = "name", length = 255)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    // 📝 [추가] 이미지 URL 필드
    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "price", nullable = false)
    private Integer price;

    @Column(name = "type", length = 255)
    private String type;

    @Column(name = "default_size", length = 255)
    private String defaultSize;

    @Column(name = "floor", length = 255)
    private String floor;

    @Column(name = "parking", nullable = false)
    private boolean parking;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Builder
    public CampingZone(AdminEntity admin, String name, String description, Integer capacity, Integer price, String type, String defaultSize, String floor, boolean parking, boolean isActive, String imageUrl) { // 생성자에 imageUrl 추가
        this.admin = admin;
        this.name = name;
        this.description = description;
        this.capacity = capacity;
        this.price = price;
        this.type = type;
        this.defaultSize = defaultSize;
        this.floor = floor;
        this.parking = parking;
        this.isActive = isActive;
        this.imageUrl = imageUrl; // 📝 imageUrl 초기화
    }

    public void update(String name, String description, Integer capacity, Integer price, String type, String defaultSize, String floor, boolean parking, boolean isActive, String imageUrl) { // update 메서드에 imageUrl 추가
        if (name != null) this.name = name;
        if (description != null) this.description = description;
        if (capacity != null) this.capacity = capacity;
        if (price != null) this.price = price;
        if (type != null) this.type = type;
        if (defaultSize != null) this.defaultSize = defaultSize;
        if (floor != null) this.floor = floor;
        this.parking = parking;
        this.isActive = isActive;
        if (imageUrl != null) this.imageUrl = imageUrl;
    }
}