package com.Campmate.DYCampmate.dto;

import com.Campmate.DYCampmate.entity.CampingZone;
import lombok.Builder;

@Builder
public record CampingZoneDto(
        Long id,
        String name,
        String description,
        int capacity,
        int price,
        String type,
        String defaultSize,
        String floor,
        boolean parking,
        boolean isActive,
        String imageUrl
) {
    public static CampingZoneDto from(CampingZone entity) {
        return CampingZoneDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .capacity(entity.getCapacity())
                .price(entity.getPrice())
                .type(entity.getType())
                .defaultSize(entity.getDefaultSize())
                .floor(entity.getFloor())
                .parking(entity.isParking())
                .isActive(entity.isActive())
                .imageUrl(entity.getImageUrl())
                .build();
    }
}