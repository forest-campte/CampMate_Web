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
@Table(name = "camping_zones")
public class ZoneEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "admims_id")
    private AdminEntity admin;

    private String name;
    private String description;
    private Integer capacity;

    @Column(name = "price_per_night")
    private Integer pricePerNight;

    private String type;

    @Column(name = "default_size")
    private String defaultSize;

    private String floor;
    private String parking;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_dt")
    private LocalDateTime createdDt;

    @Column(name = "updated_dt")
    private LocalDateTime updatedDt;
}
