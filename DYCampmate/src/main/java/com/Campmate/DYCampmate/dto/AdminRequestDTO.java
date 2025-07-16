package com.Campmate.DYCampmate.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminRequestDTO {
    private String email;
    private String password;
    private String name;
    private String description;
    private String campingStyle;
    private String campingBackground;
    private String campingType;
}
