package com.Campmate.DYCampmate.dto;

import lombok.Data;
import lombok.Getter;

@Data
public class AdminResponseDTO {
    private Integer id;
    private String email;
    private String name;
    private String campingStyle;
    private String campingBackground;
    private String campingType;


    public AdminResponseDTO(Integer id, String email, String password, String name) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.campingStyle = password;
        this.campingBackground = password;
        this.campingType = password;
    }
}
