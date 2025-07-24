package com.Campmate.DYCampmate.service;

import com.Campmate.DYCampmate.dto.ReservationDTO;
import com.Campmate.DYCampmate.entity.AdminEntity;
import com.Campmate.DYCampmate.repository.ReservationRepo;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepo reservationRepo;

    public ReservationService(ReservationRepo reservationRepo) {
        this.reservationRepo = reservationRepo;
    }

    public List<ReservationDTO> getAllReservations() {
        return reservationRepo.findAll()
                .stream()
                .map(ReservationDTO::new)
                .collect(Collectors.toList());
    }
}