package com.Campmate.DYCampmate.repository;

import com.Campmate.DYCampmate.dto.ZoneHomeViewDTO;
import com.Campmate.DYCampmate.entity.AdminEntity;
import com.Campmate.DYCampmate.entity.CampingZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampingZoneRepository extends JpaRepository<CampingZone,Long> {

    List<CampingZone> findByAdmin(AdminEntity admin);

    List<CampingZone> findAllByAdmin_Id(Long adminId);

    // 나중에 리뷰 쓸때 활성화
    /*
    @Query("SELECT new com.Campmate.DYCampmate.dto.ZoneHomeViewDTO(cz.id, cz.name, cz.description, cz.imageUrl, CAST(COALESCE(AVG(r.rating), 0.0) AS double)) " +
            "FROM CampingZone cz LEFT JOIN cz.reviews r " +
            "GROUP BY cz.id " +
            "ORDER BY cz.id DESC")
    List<ZoneHomeViewDTO> findAllWithAverageRating();
    */
}