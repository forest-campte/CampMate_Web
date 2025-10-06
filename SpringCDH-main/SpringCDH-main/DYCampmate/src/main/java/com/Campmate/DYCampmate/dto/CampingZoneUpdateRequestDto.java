// src/main/java/com/Campmate/DYCampmate/dto/CampingZoneUpdateRequestDto.java
package com.Campmate.DYCampmate.dto;

// 📝 [수정] boolean -> Integer 타입으로 변경
public record CampingZoneUpdateRequestDto(
        String name,
        String description,
        int capacity,
        int price,
        String type,
        String defaultSize,
        String floor,
        Integer parking, // boolean -> Integer
        Integer isActive // boolean -> Integer
) {
}