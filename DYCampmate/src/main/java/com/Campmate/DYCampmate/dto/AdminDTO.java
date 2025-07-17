package com.Campmate.DYCampmate.dto;

import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Data
public class AdminDTO {

    private String email;
    private String password;
    private String name;
    private String description;
    private String camping_style;
    private String camping_background;
    private String camping_type;
    private LocalDateTime create_dt;


}
