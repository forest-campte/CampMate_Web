package com.Campmate.DYCampmate.dto;

import com.Campmate.DYCampmate.entity.ReservationEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ReservationDTO {

    private Long id;
    private String customerName;
    private String customerPhone;
    private String checkIn;
    private String checkOut;
    private String status;
    private String createDt;


    public ReservationDTO(ReservationEntity entity) {
        this.id = entity.getId();
        this.customerName = entity.getCustomerName();
        this.customerPhone = entity.getCustomerPhone();
        this.checkIn = entity.getCheckIn().toString();
        this.checkOut = entity.getCheckOut().toString();
        this.status = entity.getStatus().name();
        this.createDt = entity.getCreatedDt().toString();
    }

    // Getters
}
