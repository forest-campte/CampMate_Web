package com.Campmate.DYCampmate.dto;

import com.Campmate.DYCampmate.entity.AdminEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminDTO {

    private String email;
    private String password;
    private String name;
    private String description;
    private String campingStyle;
    private String campingBackground;
    private String campingType;
    private LocalDateTime createDt;
    private String address;
    private String imageUrl;

    public static AdminDTO fromEntity(AdminEntity entity) {
        return new AdminDTO(
                entity.getEmail(),
                null, // Password should not be sent to the client
                entity.getName(),
                entity.getDescription(),
                entity.getCampingStyle(),
                entity.getCampingBackground(),
                entity.getCampingType(),
                entity.getCreateDt(),
                entity.getAddress(),
                entity.getImageUrl()
        );
    }
}