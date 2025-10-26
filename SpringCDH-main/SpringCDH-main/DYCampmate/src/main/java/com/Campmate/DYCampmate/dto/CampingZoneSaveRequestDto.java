package com.Campmate.DYCampmate.dto;

import com.Campmate.DYCampmate.entity.AdminEntity;
import com.Campmate.DYCampmate.entity.CampingZone;

public record CampingZoneSaveRequestDto(
        String name,
        String description,
        int capacity,
        int price,
        String type,
        String defaultSize,
        String floor,
        Integer parking,
        Integer isActive,
        String imageUrl
) {
    public CampingZone toEntity(AdminEntity admin) {
        return CampingZone.builder()
                .admin(admin)
                .name(name)
                .description(description)
                .capacity(capacity)
                .price(price)
                .type(type)
                .defaultSize(defaultSize)
                .floor(floor)
                .parking(parking == 1)
                .isActive(isActive == 1)
                .imageUrl(imageUrl)
                .build();
    }
}