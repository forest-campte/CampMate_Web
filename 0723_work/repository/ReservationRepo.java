package com.Campmate.DYCampmate.repository;

import com.Campmate.DYCampmate.entity.AdminEntity;
import com.Campmate.DYCampmate.entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepo extends JpaRepository<ReservationEntity, Long> {
    List<ReservationEntity> findByCampingZone_Admin(AdminEntity admin);
}